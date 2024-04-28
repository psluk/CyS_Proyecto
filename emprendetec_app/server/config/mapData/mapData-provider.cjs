const Database = require("better-sqlite3");
const { join } = require("path");

const mapData = new Database(join(__dirname, "mapData.db"));
mapData.pragma("journal_mode = WAL");

const searchMap = (searchTerm) => {
  const results = mapData.prepare(`
      SELECT id, name, building_number, latitude, longitude, type
      FROM (SELECT n.id,
                   n.name,
                   n.building_number,
                   n.latitude,
                   n.longitude,
                   group_concat(DISTINCT c.name || ': ' || t.name) as type
            FROM nodes n
                     LEFT JOIN node_types nt ON n.id = nt.node_id
                     JOIN types t ON nt.type_id = t.id
                     JOIN categories c ON t.categoryId = c.id
            WHERE n.normalized_name LIKE ?
               OR n.building_number LIKE ?
            GROUP BY n.id
            UNION
            SELECT w.id,
                   w.name,
                   w.building_number,
                   AVG(n.latitude)                                 as latitude,
                   AVG(n.longitude)                                as longitude,
                   group_concat(DISTINCT c.name || ': ' || t.name) as type
            FROM ways w
                     JOIN way_nodes w_n ON w.id = w_n.way_id
                     JOIN nodes n ON w_n.node_id = n.id
                     LEFT JOIN way_types wt ON w.id = wt.way_id
                     JOIN types t ON wt.type_id = t.id
                     JOIN categories c ON t.categoryId = c.id
            WHERE w.normalized_name LIKE ?
               OR w.building_number LIKE ?
            GROUP BY w.id
            UNION
            SELECT r.id,
                   r.name,
                   r.building_number,
                   AVG(n.latitude)                                 as latitude,
                   AVG(n.longitude)                                as longitude,
                   group_concat(DISTINCT c.name || ': ' || t.name) as type
            FROM relations r
                     LEFT OUTER JOIN relation_ways r_w ON r.id = r_w.relation_id
                     JOIN ways w ON r_w.way_id = w.id
                     JOIN way_nodes w_n ON w.id = w_n.way_id
                     LEFT OUTER JOIN relation_nodes r_n ON r.id = r_n.relation_id
                     JOIN nodes n ON w_n.node_id = n.id OR r_n.node_id = n.id
                     LEFT JOIN relation_types rt ON r.id = rt.relation_id
                     JOIN types t ON rt.type_id = t.id
                     JOIN categories c ON t.categoryId = c.id
            WHERE r.normalized_name LIKE ?
               OR r.building_number LIKE ?
            GROUP BY r.id)
      WHERE id IS NOT NULL
      GROUP BY id;
  `).all(`%${searchTerm}%`, `${searchTerm}`, `%${searchTerm}%`, `${searchTerm}`, `%${searchTerm}%`, `${searchTerm}`);

  // Convert the string of types to an array
  results.forEach((result) => {
    result.type = result.type.split(",").map((t) => {
      const [category, type] = t.split(": ");
      return { category, type };
    });
  });

  return results;
};

module.exports = { searchMap };