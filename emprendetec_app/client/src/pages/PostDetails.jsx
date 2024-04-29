import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import UseAxios from "../config/customAxios.js";
import { useParams } from 'react-router-dom';
import { Rating } from "@material-tailwind/react";
import ImageGallery from "react-image-gallery";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import "react-image-gallery/styles/css/image-gallery.css";
import { analytics } from "../config/firebase-config";
import { logEvent } from "firebase/analytics";
export default function PostDetails() {
  const axios = UseAxios();
  const { getUserID } = useSession();
  const [post, setPost] = useState([]);
  const [score, setScore] = useState(1);
  const [images, setImages] = useState([]);
  const params = useParams();

  useEffect(() => {
    setScore(post.Score);
    fetchPost();
    fetchImages();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/emprendimientos/emprendimiento/${params.id}`);

      if (
        response.data &&
        response.data.post &&
        response.data.post.length > 0
      ) {
        setPost(response.data.post[0]);
        if (analytics) {
          logEvent(analytics, "view_post", {
            post_id: params.id,
            user_id: getUserID() ? getUserID() : null,
            post_title: response.data.post[0].Title,
          });
        }
        const newScore = Math.round(response.data.post[0].Score);
        setScore(4);
      }
    } catch (error) {
      console.error("Error al obtener el emprendimiento:", error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `/api/emprendimientos/imagenes/${params.id}`,
      );

      if (
        response.data &&
        response.data.images &&
        response.data.images.length > 0
      ) {
        setImages(response.data.images);
      }
    } catch (error) {
      console.error("Error al obtener el emprendimiento:", error);
    }
  };

  const urlNavigate = () => {
    if (post.UserID === getUserID()) {
      return `/perfil`;
    } else return `/usuario/${post.UserID}`;
  };

  const getImages = () => {
    if (images.length != 0)
      return (
        <ImageGallery
          items={images}
          additionalClass={`style.${image_gallery}`}
        />
      );
    else
      return <img className="mb-2 rounded-2xl" src="/default/no-image.jpeg" />;
  };

  const getRating = () => {
    return <Rating value={post.Score} />;
  };

  // const score = Math.round(post.Score)
  console.log(`Score: ${score} + ${typeof(score)}`)
  console.log(`Score2: ${post.Score} + ${typeof(post.Score)}`)

  return (
    <>
      <Helmet>
        <title>Emprednimiento | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos/:id" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-16 px-10">
        <div className="flex flex-col-reverse md:flex-row md:min-h-screen w-full items-start justify-start bg-white">
          <div>{getImages()}</div>
          <div className="w-full mb-5 md:ml-16">
            <h1 className="text-3xl font-bold">{post && post.Title}</h1>
            <Link to={urlNavigate()}>
              <h2 className="text-gray-600 mb-8">{post.FullName}</h2>
            </Link>
            {getRating()}
            <p className="mt-8">{post && post.DescriptionPost}</p>
          </div>
        </div>
      </main>
    </>
  );
}

const image_gallery = {
  width: "12",
  height: "12",
};
