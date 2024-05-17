import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import UseAxios from "../config/customAxios.js";
import { useParams } from "react-router-dom";
import { Rating, Input, Button, Textarea } from "@material-tailwind/react";
import ImageGallery from "react-image-gallery";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import "react-image-gallery/styles/css/image-gallery.css";
import { analytics } from "../config/firebase-config";
import { logEvent } from "firebase/analytics";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import customMapMarker from "../components/CustomMapMarker.js";
import "../styles/imageGallery.css";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { defaultError } from "../utils/ErrorSettings.js";

export default function PostDetails() {
  const axios = UseAxios();
  const { getUserID, getUserEmail, loading } = useSession();
  const [post, setPost] = useState(null);
  const [score, setScore] = useState(0);
  const [images, setImages] = useState([]);
  const params = useParams();
  const markerRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compReview, setCompReview] = useState(false);
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchPost();
    fetchImages();
  }, []);

  useEffect(() => {
    if (
      post &&
      post.locationX !== null &&
      post.locationY !== null &&
      post.locationX !== undefined &&
      post.locationY !== undefined
    ) {
      const marker = markerRef.current;
      if (marker) {
        marker.openPopup();
      }
    }
  }, [post]);

  useEffect(() => {
    if (post && !loading) {
      axios
        .get(`/api/calificaciones/emprendimiento/${params.id}`)
        .then((response) => {
          if (
            response.data &&
            response.data.post &&
            response.data.post.userRating !== undefined
          ) {
            setScore(response.data.post.userRating);
          }
        });
    }
  }, [post, loading]);

  const handleSetScore = (newScore) => {
    if (newScore >= 1 && newScore <= 5 && getUserID() && !isSubmitting) {
      axios
        .post("/api/calificaciones", {
          email: getUserEmail(),
          postId: params.id,
          score: newScore,
          comment: review,
        })
        .then(() => {
          toast.success("Calificación agregada correctamente.");
          setScore(newScore);
          axios
            .get(`/api/calificaciones/emprendimiento/${params.id}`)
            .then((response) => {
              if (
                response.data &&
                response.data.post &&
                response.data.post.rating !== undefined
              ) {
                setPost({ ...post, Score: response.data.post.rating });
              }
            });
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message ?? defaultError);
        })
        .finally(() => setIsSubmitting(false));
      
      setCompReview(true);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `/api/emprendimientos/emprendimiento/${params.id}`,
      );

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
    if (post?.UserID === getUserID()) {
      return `/perfil`;
    } else return `/usuario/${post?.UserID}`;
  };

  const getImages = () => {
    if (images.length !== 0)
      return (
        <div className="w-full max-w-sm">
          <ImageGallery items={images} />
        </div>
      );
    else
      return <img className="mb-2 rounded-2xl" src="/default/no-image.jpeg" />;
  };

  const showComponentReview = () => {
    if (compReview)
      return (
        <div className="md:w-2/3 lg:w-1/2">
          <Textarea
            name="textarea"
            label="Opiniones"
            onChange={(e) => setReview(e.target.value)}>
          </Textarea>
          <div className="flex justify-end">
            <Button className="mt-2" onClick={() => handleSetScore(score)}>Enviar</Button>
          </div>
        </div>
      )
  };

  return (
    <>
      <Helmet>
        <title>Emprendimiento | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos/:id" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-16 px-10">
        <div className="flex w-full flex-col items-start justify-start bg-white md:flex-row">
          <div>{getImages()}</div>
          <div className="mb-5 w-full md:ml-16">
            <h1 className="text-3xl font-bold">{post && post.Title}</h1>
            <Link to={urlNavigate()}>
              <h2 className="mb-8 text-gray-600">{post?.FullName}</h2>
            </Link>
            <div>
            <p className="mb-8">{post && post.DescriptionPost}</p>
            <div className="flex flex-row gap-2 mb-2">
              <span>
                <FontAwesomeIcon
                  icon={faStar}
                  className="me-2 inline h-4 w-4 text-yellow-800 drop-shadow-md"
                />
                {post?.Score
                  ? post.Score.toLocaleString(["es-CR", "es"], {
                      maximumFractionDigits: 1,
                    })
                  : "Sin calificaciones"}
              </span>
              {post?.UserID !== getUserID() && !loading && (
                <>
                  <span className="mx-1 font-bold">·</span>
                  <Rating
                    value={score}
                    onChange={(e) => handleSetScore(e)}
                    readonly={isSubmitting}
                  />
                </>
              )}
              {post?.UserID === getUserID() && !loading && (
                <>
                  <Link to={`/calificaciones/${params.id}`}><Button>Ver Calificaciones y Opiniones</Button></Link>
                </>
              )}
            </div>
            {showComponentReview()}
            </div>
            
            {post &&
              post.locationX !== null &&
              post.locationY !== null &&
              post.locationX !== undefined &&
              post.locationY !== undefined && (
                <div className="flex w-full flex-col">
                  <h1 className="mb-4 mt-8 w-full text-3xl font-bold text-teal-600">
                    Dónde se ubica
                  </h1>
                  <div className="w-full overflow-hidden border-2 border-gray-300 md:rounded-xl [&>.leaflet-container]:h-[calc(100vh-15rem)] [&>.leaflet-container]:min-h-[30rem]">
                    <MapContainer
                      center={[post.locationY, post.locationX]}
                      zoom={17}
                      scrollWheelZoom={true}
                      className={"h-full w-full"}
                    >
                      <TileLayer
                        attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[post.locationY, post.locationX]}
                        icon={customMapMarker}
                        ref={markerRef}
                      >
                        {post.location && <Popup>{post.location}</Popup>}
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              )}
          </div>
        </div>
      </main>
    </>
  );
}
