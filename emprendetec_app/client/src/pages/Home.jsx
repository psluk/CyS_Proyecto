import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { defaultError } from "../utils/ErrorSettings";
import { Helmet } from "react-helmet-async";
import { Button, Input, Spinner } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNetworkWired } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const [postsList, setPostsList] = useState([]);
  const [entrepreneursList, setEntrepreneursList] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("api/usuarios/top-usuarios/usuarios");
      if (response.data && response.data.users) {
        setEntrepreneursList(response.data.users);
      }
    } catch (error) {
      toast.error(defaultError);
    }
  };

  useEffect(() => {
    setLoading(true); // Inicia el spinner al comenzar la carga
    axios
      .get("/api/emprendimientos")
      .then((response) => {
        const posts = response.data.posts;
        const sortedPosts = posts.sort((a, b) => b.Score - a.Score);
        const topSixPosts = sortedPosts.slice(0, 6);
        setPostsList(topSixPosts);
        fetchUsers();
      })
      .catch((error) => {
        toast.error(defaultError);
      })
      .finally(() => {
        setLoading(false); // Detiene el spinner independientemente del resultado
      });
  }, []);

  useEffect(() => {
    if (searchParams.has("showEmailVerificationSuccess")) {
      toast.success("Correo electrónico verificado correctamente.");
    }
  }, [searchParams]);

  const getImagePost = (post) => {
    return (
      <img
        src={post.ImagePost ? post.ImagePost : "/default/no-image.jpeg"}
        alt={post.ImagePost ? post.Title : "No image available"}
        className="aspect-square rounded-lg object-fill"
      />
    );
  };

  const handleClick = () => {
    console.log(entrepreneursList);
  };
  return (
    <>
      <Helmet>
        <title>Inicio | EmprendeTEC</title>
        <link rel="canonical" href="/" />
      </Helmet>
      <main className="relative w-full max-w-7xl space-y-10 px-10">
        <div className="text-xl">
          <p className="text-red-600">
            ¿Eres un emprendedor? Llena nuestra encuesta y ayudanos a mejorar:
          </p>
          <Link
            to="https://forms.gle/EDSANh3JFMzartuD9"
            className="text-teal-600"
            target="_blank"
          >
            https://forms.gle/EDSANh3JFMzartuD9
          </Link>
        </div>
        {loading ? (
          <div className="h-full w-full ">
            <Spinner className="mx-auto h-12 w-12" color={"teal"} />
          </div>
        ) : (
          <div className="space-y-10">
            {postsList.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-center font-sans text-3xl font-bold text-teal-900 sm:text-4xl lg:text-5xl">
                  Mira los emprendimientos más destacados
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {postsList.map((post) => (
                    <div key={post.ID} className="rounded-lg bg-gray-100 p-4">
                      <Link to={`/emprendimientos/${post.ID}`}>
                        {getImagePost(post)}
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
              </div>
            )}
            {entrepreneursList.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-center font-sans text-3xl font-bold text-teal-900 sm:text-4xl lg:text-5xl">
                  Mira los emprendedores más destacados.
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {entrepreneursList.map((entrepreneur) => (
                    <div
                      key={entrepreneur.userId}
                      className="rounded-lg bg-gray-100 p-4"
                    >
                      <Link to={`/usuario/${entrepreneur.userId}`}>
                        <img
                          src={
                            entrepreneur.profilePictureUrl
                              ? entrepreneur.profilePictureUrl
                              : "/default/no-image.jpeg"
                          }
                          alt={`${entrepreneur.givenName} ${entrepreneur.familyName}`}
                          className="aspect-square rounded-lg object-fill"
                        />
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">
                            {entrepreneur.givenName} {entrepreneur.familyName}
                          </h3>
                          <div className="flex items-center justify-between">
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
                              {entrepreneur.rating ? entrepreneur.rating : 0}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
