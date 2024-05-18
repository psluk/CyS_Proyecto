import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const [postsList, setPostsList] = useState([]);
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState("/default/perfil.png");
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `/api/emprendimientos/usuario/${params.id}`,
      );
      if (response.data && response.data.posts) {
        setPostsList(response.data.posts);
      }
    } catch (error) {
      console.error("Error al obtener los emprendimientos:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/usuarios/${params.id}`);
      if (response.data && response.data.user) {
        setUser(response.data.user[0]);
        if (response.data.user[0].ImageUser != null) {
          setUserImage(response.data.user[0].ImageUser);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
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

  const handleContactClick = () => {
    navigate(`/chat/${params.id}`);
  };

  return (
    <>
      <Helmet>
        <title>{user ? user.FullName : "Perfil"} | EmprendeTEC</title>
        <link rel="canonical" href={`/perfil/${params.id ?? ""}`} />
      </Helmet>
      <main className="w-full max-w-7xl space-y-16 px-10">
        <div className="flex min-h-screen w-full flex-col items-start justify-start bg-white">
          <div className="left flex w-full gap-4">
            <div className="flex w-full items-center">
              {isLoading ? (
                <div className="size-28 animate-pulse rounded-full bg-blue-gray-100/50"></div>
              ) : (
                <img
                  src={userImage}
                  alt="perfil.jpg"
                  className="aspect-square size-28 rounded-full object-cover"
                />
              )}
              <div className="ml-4">
                {isLoading ? (
                  <div className="h-6 w-80 animate-pulse rounded-xl bg-teal-200/50"></div>
                ) : (
                  <h2 className="font-bxold text-2xl text-teal-600">
                    {user.FullName}
                  </h2>
                )}
                <div className="mt-4 flex items-center text-gray-500">
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
                  {isLoading ? (
                    <div className="ms-1 h-5 w-12 animate-pulse rounded-xl bg-gray-200/50"></div>
                  ) : (
                    <span className="ms-1">
                      {user.Score
                        ? user.Score.toLocaleString(["es-CR", "es"], {
                            maximumFractionDigits: 1,
                          })
                        : "Sin calificaciones"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-1/2 space-y-2 text-right">
              <Button onClick={handleContactClick} color="green">
                Contactar
              </Button>
            </div>
          </div>
          <div className="mt-16">
            <h1 className="mb-8 text-3xl font-bold text-teal-600">
              Últimos emprendimientos
            </h1>
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Spinner className="h-16 w-16" color="teal" />
              </div>
            ) : postsList.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-2xl font-bold text-gray-500">
                  No hay emprendimientos
                </p>
              </div>
            ) : (
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {postsList.map((post) => (
                  <div key={post.ID} className="rounded-lg bg-gray-100 p-4">
                    <Link to={`/emprendimientos/${post.ID}`}>
                      {getImage(post)}
                      <div className="mt-2 items-center justify-between">
                        <h3 className="text-lg font-medium">{post.Title}</h3>
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
                            {post.Score}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
