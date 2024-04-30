import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import UseAxios from "../config/customAxios.js";
import { Link } from "react-router-dom";
import { Input, Button, Spinner } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "../context/SessionContext.jsx";

export default function Emprendimientos() {
  const axios = UseAxios();
  const [postsList, setPostsList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { getUserID, loading, getUserType } = useSession();
  const [userId, setUserId] = useState(getUserID());

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!loading) {
      setUserId(getUserID());
    }
  }, [loading]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/emprendimientos");
      if (response.data && response.data.posts) {
        setPostsList(response.data.posts);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los emprendimientos:", error);
    }
  };

  const fetchFilterPosts = async () => {
    try {
      const response = await axios.get(`/api/emprendimientos/${filterText}`);
      if (response.data && response.data.posts) {
        setPostsList(response.data.posts);
      }
    } catch (error) {
      console.error("Error al obtener los emprendimientos:", error);
    }
  };

  const getImage = (post) => {
    if (post.ImagePost)
      return (
        <img
          src={post.ImagePost}
          alt={post.Title}
          className="aspect-square w-full rounded-lg object-cover"
        />
      );
    else
      return <img className="mb-2 rounded-2xl" src="/default/no-image.jpeg" />;
  };

  return (
    <>
      <Helmet>
        <title>Emprendimientos | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-16 md:px-10">
        <div className="flex min-h-screen w-full flex-col-reverse items-start justify-start bg-white md:flex-row">
          {/* EMPRENDIMIENTOS */}
          <div className="w-full">
            <div className="mb-8 flex flex-col items-center gap-2 md:flex-row md:justify-between">
              <h1 className="text-3xl font-bold text-teal-600">
                Listado de emprendimientos
              </h1>
              <Link to="/emprendimientos/mapa">
                <Button color="blue">Ver mapa</Button>
              </Link>
            </div>
            <div className="flex min-h-screen w-full flex-col-reverse items-start justify-start bg-white md:flex-row">
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Spinner className="h-16 w-16" color="teal" />
                </div>
              ) : (
                <div className="grid w-full grid-cols-1 gap-4 px-10 md:grid-cols-2 md:px-0 lg:grid-cols-3">
                  {postsList.map((post) => (
                    <div key={post.ID} className="rounded-lg bg-gray-100 p-4">
                      <Link to={`/emprendimientos/${post.ID}`}>
                        {getImage(post)}
                        <div className="mt-2 items-center justify-between">
                          <span className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">
                              {post.Title}
                            </h3>
                            {(post.userId === userId ||
                              getUserType() === "Administrator") && (
                              <Link
                                to={`/emprendimientos/modificar/${post.ID}`}
                              >
                                <FontAwesomeIcon
                                  icon={faPencil}
                                  className="h-4 w-4 text-blue-gray-800"
                                />
                              </Link>
                            )}
                          </span>
                          <div className="flex items-center justify-between">
                            <h2 className="text-gray-600">{post.FullName}</h2>
                            <span className="flex items-center text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                color="#F4D93F"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6 fill-yellow-600"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                />
                              </svg>
                              {post.Score || "-"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* FILTRAR */}
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
                        onClick={fetchFilterPosts}
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
