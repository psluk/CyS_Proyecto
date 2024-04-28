import xml.etree.ElementTree as ET
import sqlite3
import os
import unicodedata

# Get the current directory
current_dir = os.path.dirname(os.path.realpath(__file__))

# Considered tags
CONSIDERED_TAGS = ['amenity', 'barrier', 'building', 'healthcare', 'historic', 'landuse', 'leisure', 'man_made',
                   'natural', 'office', 'public_transport', 'shop', 'sport', 'water']


def normalize(text):
    if text is None:
        return None
    normalized_text = ''.join(
        char for char in unicodedata.normalize('NFKD', text) if unicodedata.category(char) != 'Mn')
    return normalized_text.lower()


def get_real_path(file_name: str) -> str:
    """
    Get the real path of a file.
    :param file_name: Path of the file in relation to the current directory.
    :return: The real path of the file.
    """
    return os.path.join(current_dir, file_name)


def get_element_data(element: ET.Element) -> dict:
    """
    Get the data of an element.
    :param element: The element to get the data from.
    :return: The data of the element.
    """
    data = {"id": element.attrib["id"], "tags": {}}

    if "lat" in element.attrib and "lon" in element.attrib:
        data["lat"] = float(element.attrib["lat"])
        data["lon"] = float(element.attrib["lon"])

    for tag in element:
        if tag.tag == "tag":
            if tag.attrib["v"] == "" or tag.attrib["v"] == "yes" or tag.attrib["v"] == "no":
                continue
            if tag.attrib["k"] in CONSIDERED_TAGS:
                data["tags"][tag.attrib["k"]] = tag.attrib["v"]
            elif tag.attrib["k"] == "name":
                data["name"] = tag.attrib["v"]
            elif tag.attrib["k"] == "addr:housenumber":
                data["building_number"] = tag.attrib["v"]

    return data


def parse_osm_file(osm_file: str) -> tuple:
    tree = ET.parse(get_real_path(osm_file))
    root = tree.getroot()

    nodes = []
    ways = []
    relations = []

    for element in root:
        if element.tag == "node":
            # Save id, lat, lon from <node>
            # Save map feature type, name, and house number from <tag>
            node = get_element_data(element)
            nodes.append(node)
        elif element.tag == "way":
            # Save id from <way>
            # Save map feature type, name, and house number from <tag>
            way = get_element_data(element)
            way["nodes"] = []

            # Save nodes from <nd>
            for nd in element:
                if nd.tag == "nd":
                    way["nodes"].append(nd.attrib["ref"])

            ways.append(way)
        elif element.tag == "relation":
            # Save id from <relation>
            # Save map feature type, name, and house number from <tag>
            relation = get_element_data(element)
            relation["members"] = []

            # Save members from <member>
            for member in element:
                if member.tag == "member":
                    relation["members"].append(
                        {"type": member.attrib["type"], "ref": member.attrib["ref"], "role": member.attrib["role"]})

            relations.append(relation)

    # Filter out relations without tags or without name
    relations = [relation for relation in relations if "name" in relation and len(relation["tags"]) > 0]

    # Filter out ways without tags or without name that are not part of a relation
    # or with "building"="house" tag
    ways = [way for way in ways if "name" in way and len(way["tags"]) > 0 and (
                "building" not in way["tags"] or way["tags"]["building"] != "house") or any(
        [way["id"] in [member["ref"] for member in relation["members"]] for relation in relations])]

    # Filter out nodes without tags or without name that are not part of a way or relation
    # or with "building"="house" tag
    nodes = [node for node in nodes if
             "name" in node and len(node["tags"]) > 0 or any([node["id"] in way["nodes"] for way in ways]) and (
                         "building" not in node["tags"] or node["tags"]["building"] != "house") or any(
                 [node["id"] in [member["ref"] for member in relation["members"]] for relation in relations])]

    print(len(nodes), len(ways), len(relations))

    return nodes, ways, relations


def setup_database(database_file: str) -> tuple:
    conn = sqlite3.connect(get_real_path(database_file))
    c = conn.cursor()

    # Delete existing information
    c.execute("DROP TABLE IF EXISTS way_nodes")
    c.execute("DROP TABLE IF EXISTS relation_nodes")
    c.execute("DROP TABLE IF EXISTS relation_ways")
    c.execute("DROP TABLE IF EXISTS relation_types")
    c.execute("DROP TABLE IF EXISTS relations")
    c.execute("DROP TABLE IF EXISTS way_types")
    c.execute("DROP TABLE IF EXISTS ways")
    c.execute("DROP TABLE IF EXISTS node_types")
    c.execute("DROP TABLE IF EXISTS nodes")
    c.execute("DROP TABLE IF EXISTS types")
    c.execute("DROP TABLE IF EXISTS categories")

    # Create tables
    c.execute('''
        CREATE TABLE IF NOT EXISTS categories
        (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS types
        (id INTEGER PRIMARY KEY AUTOINCREMENT, categoryId INTEGER REFERENCES categories(id), name TEXT);
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS nodes
        (id INTEGER PRIMARY KEY, name TEXT, normalized_name TEXT, building_number TEXT, latitude REAL, longitude REAL);
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS node_types
        (node_id INTEGER REFERENCES nodes(id), type_id INTEGER REFERENCES types(id));
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS ways
        (id INTEGER PRIMARY KEY, name TEXT, normalized_name TEXT, building_number TEXT);
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS way_types
        (way_id INTEGER REFERENCES ways(id), type_id INTEGER REFERENCES types(id));
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS relations
        (id INTEGER PRIMARY KEY, name TEXT, normalized_name TEXT, building_number TEXT);
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS relation_types
        (relation_id INTEGER REFERENCES relations(id), type_id INTEGER REFERENCES types(id));
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS relation_ways
        (relation_id INTEGER, way_id INTEGER REFERENCES ways(id));
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS relation_nodes
        (relation_id INTEGER, node_id INTEGER REFERENCES nodes(id));
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS way_nodes
        (way_id INTEGER, node_id INTEGER REFERENCES nodes(id));
    ''')

    conn.commit()

    return conn, c


def insert_data(conn: sqlite3.Connection, c: sqlite3.Cursor, nodes: list, ways: list, relations: list):
    # Get categories
    # (Get all distinct tags from nodes, ways, and relations and their types)

    categories = {}

    for element in [*nodes, *ways, *relations]:
        for tag in element["tags"]:
            if tag not in categories:
                categories[tag] = []

            if element["tags"][tag] not in categories[tag]:
                categories[tag].append(element["tags"][tag])

    # Insert categories
    for category in categories:
        c.execute('''
            INSERT INTO categories (name)
            VALUES (?);
        ''', (category,))

    # Insert types
    for category in categories:
        for type in categories[category]:
            c.execute('''
                INSERT INTO types (categoryId, name)
                VALUES ((SELECT id FROM categories WHERE name = ?), ?);
            ''', (category, type))

    # Insert nodes
    for node in nodes:
        c.execute('''
            INSERT INTO nodes (id, name, normalized_name, building_number, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?);
        ''', (node["id"], node.get("name", None), None if node.get("name", None) is None else normalize(node["name"]),
              node.get("building_number", None), node["lat"], node["lon"]))

        # Insert node types
        for tag in node["tags"]:
            c.execute('''
                INSERT INTO node_types (node_id, type_id)
                VALUES (?, (SELECT id FROM types WHERE categoryId = (SELECT id FROM categories WHERE name = ?) AND name = ?));
            ''', (node["id"], tag, node["tags"][tag]))

    # Insert ways
    for way in ways:
        c.execute('''
            INSERT INTO ways (id, name, normalized_name, building_number)
            VALUES (?, ?, ?, ?);
        ''', (way["id"], way.get("name", None), None if way.get("name", None) is None else normalize(way["name"]),
              way.get("building_number", None)))

        # Insert way types
        for tag in way["tags"]:
            c.execute('''
                INSERT INTO way_types (way_id, type_id)
                VALUES (?, (SELECT id FROM types WHERE categoryId = (SELECT id FROM categories WHERE name = ?) AND name = ?));
            ''', (way["id"], tag, way["tags"][tag]))

        # Insert way nodes
        for node in way["nodes"]:
            c.execute('''
                INSERT INTO way_nodes (way_id, node_id)
                VALUES (?, ?);
            ''', (way["id"], node))

    # Insert relations
    for relation in relations:
        c.execute('''
            INSERT INTO relations (id, name, normalized_name, building_number)
            VALUES (?, ?, ?, ?);
        ''', (relation["id"], relation.get("name", None),
              None if relation.get("name", None) is None else normalize(relation["name"]),
              relation.get("building_number", None)))

        # Insert relation types
        for tag in relation["tags"]:
            c.execute('''
                INSERT INTO relation_types (relation_id, type_id)
                VALUES (?, (SELECT id FROM types WHERE categoryId = (SELECT id FROM categories WHERE name = ?) AND name = ?));
            ''', (relation["id"], tag, relation["tags"][tag]))

        # Insert relation members
        for member in relation["members"]:
            if member["type"] == "way":
                c.execute('''
                    INSERT INTO relation_ways (relation_id, way_id)
                    VALUES (?, ?);
                ''', (relation["id"], member["ref"]))
            elif member["type"] == "node":
                c.execute('''
                    INSERT INTO relation_nodes (relation_id, node_id)
                    VALUES (?, ?);
                ''', (relation["id"], member["ref"]))

    # Commit changes
    conn.commit()
    conn.close()


if __name__ == "__main__":
    nodes, ways, relations = parse_osm_file("tecMap.osm")

    # Create mapData/ folder if it does not exist
    if not os.path.exists(get_real_path("../emprendetec_app/server/config/mapData")):
        os.makedirs(get_real_path("../emprendetec_app/server/config/mapData"))

    conn, c = setup_database("../emprendetec_app/server/config/mapData/mapData.db")
    insert_data(conn, c, nodes, ways, relations)
