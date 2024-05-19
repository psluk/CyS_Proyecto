import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { defaultError } from "../utils/ErrorSettings";
import { Helmet } from "react-helmet-async";
import { Button, Spinner } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePollVertical,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Home() {
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
      .catch(() => {
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
        className="aspect-square h-auto w-full rounded-lg object-cover"
      />
    );
  };

  return (
    <>
      <Helmet>
        <title>Inicio | EmprendeTEC</title>
        <link rel="canonical" href="/" />
      </Helmet>
      <main className="relative w-full max-w-7xl space-y-10 px-10">
        <div className="flex w-full flex-row items-center gap-3 rounded-xl bg-gray-200 p-5 text-lg shadow-lg md:text-xl">
          <FontAwesomeIcon
            icon={faSquarePollVertical}
            className="size-16 text-teal-500 drop-shadow-md"
          />
          <p className="text-red-800">
            ¿Sos un emprendedor? Llená nuestra encuesta y ayudanos a mejorar:{" "}
            <Link
              to="https://forms.gle/EDSANh3JFMzartuD9"
              target="_blank"
              referrerPolicy="no-referrer"
              className="mx-auto mt-2 flex justify-center md:mt-0 md:inline"
            >
              <Button
                className="mx-auto animate-pulse md:me-0 md:ms-2"
                color="teal"
              >
                Ver encuesta
              </Button>
            </Link>
          </p>
        </div>
        {loading ? (
          <div className="h-full w-full ">
            <Spinner className="mx-auto h-12 w-12" color={"teal"} />
          </div>
        ) : (
          <div className="space-y-10">
            {postsList.length > 0 && (
              <div className="space-y-6">
                <h1 className="text-center font-sans text-xl font-bold text-teal-900 sm:text-2xl md:text-start lg:text-3xl">
                  Emprendimientos más destacados
                </h1>
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
                <h1 className="text-center font-sans text-xl font-bold text-teal-900 sm:text-2xl md:text-start lg:text-3xl">
                  Emprendedores más destacados
                </h1>
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
                          className="aspect-square h-auto w-full rounded-lg object-fill"
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
