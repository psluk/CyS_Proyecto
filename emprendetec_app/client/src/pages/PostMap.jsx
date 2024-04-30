import useAxios from "../config/customAxios.js";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { defaultError } from "../utils/ErrorSettings.js";
import { defaultZoom, tecCoordinates } from "../constants/mapData.js";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import customMapMarker from "../components/CustomMapMarker.js";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PostMap() {
  const axios = useAxios();
  const [postsList, setPostsList] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchPosts("");
  }, []);

  const fetchPosts = async (filterText) => {
    axios
      .get(
        (filterText || "").trim() !== ""
          ? `/api/emprendimientos/${filterText}`
          : "/api/emprendimientos",
      )
      .then((response) => {
        if (response.data && response.data.posts) {
          setPostsList(response.data.posts);
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? defaultError);
      });
  };

  return (
    <>
      <Helmet>
        <title>Mapa de emprendimientos | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos/mapa" />
      </Helmet>
      <main className="h-full w-full max-w-7xl md:px-10">
        <div className="flex h-full w-full flex-col-reverse items-start bg-white md:flex-row">
          {/* EMPRENDIMIENTOS */}
          <div className="w-full">
            <div className="mb-8 flex flex-col items-center gap-2 md:flex-row md:justify-between">
              <h1 className="text-3xl font-bold text-teal-600">
                Mapa de emprendimientos
              </h1>
              <Link to="/emprendimientos">
                <Button color="blue">Ver listado</Button>
              </Link>
            </div>
            <div className="flex h-full w-full flex-col-reverse items-start justify-start bg-white md:flex-row">
              <div className="w-full overflow-hidden border-2 border-gray-300 md:rounded-xl [&>.leaflet-container]:h-[calc(100vh-15rem)] [&>.leaflet-container]:min-h-[30rem]">
                <MapContainer
                  center={tecCoordinates}
                  zoom={defaultZoom}
                  scrollWheelZoom={true}
                  className={"h-full w-full"}
                >
                  <TileLayer
                    attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MarkerClusterGroup chunkedLoading>
                    {postsList
                      .filter(
                        (post) =>
                          post.locationY !== null &&
                          post.locationX !== null &&
                          post.locationY !== undefined &&
                          post.locationX !== undefined,
                      )
                      .map((post) => (
                        <Marker
                          key={post.ID}
                          position={[post.locationY, post.locationX]}
                          icon={customMapMarker}
                        >
                          <Popup>
                            <Link to={`/emprendimientos/${post.ID}`}>
                              <img
                                src={post.ImagePost ?? "/default/no-image.jpeg"}
                                alt={post.Title}
                                className="aspect-square w-full rounded-lg object-cover"
                              />
                              <div className="mt-2 items-center justify-between">
                                <h3 className="text-lg font-medium">
                                  {post.Title}
                                </h3>
                                <div className="flex items-center justify-between">
                                  <h2 className="text-gray-600">
                                    {post.FullName}
                                  </h2>
                                  <span className="flex items-center text-gray-500">
                                    <FontAwesomeIcon
                                      icon={faStar}
                                      className="me-1 ms-2 h-4 w-4 text-yellow-800 drop-shadow-md"
                                    />
                                    {post.Score || "-"}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </Popup>
                        </Marker>
                      ))}
                  </MarkerClusterGroup>
                </MapContainer>
              </div>
              <div className="mb-5 w-full bg-gray-200 p-8 px-10 shadow-md md:ml-10 md:w-72 md:rounded-xl md:px-8">
                <div className="mb-8 w-full">
                  <div>
                    <h2 className="mb-5 text-2xl font-bold text-teal-600">
                      Filtrar
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Input
                          value={filterText}
                          label="Buscar"
                          placeholder=""
                          color="teal"
                          onChange={(e) => setFilterText(e.target.value)}
                          className="w-full bg-white"
                        ></Input>
                      </div>
                      <Button
                        className="w-full bg-teal-500 text-center font-bold text-white hover:bg-teal-700"
                        onClick={() => fetchPosts(filterText)}
                      >
                        Buscar
                      </Button>
                    </div>
                    <div className="mt-3 md:mt-32">
                      <Link to={"/emprendimientos/crear"} className="w-full">
                        <Button color="cyan" className="w-full">
                          Crear publicación
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
