import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import UseAxios from "../config/customAxios.js";
import { useParams } from "react-router-dom";
import { Button, Avatar, Checkbox, Typography } from "@material-tailwind/react";
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

export default function Reviews() {
  const axios = UseAxios();
  const [reviewsList, setReviewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
      axios.get(`/api/calificaciones/${params.id}`)
      .then((response) => {
        setReviewsList(response.data.reviews);
      })
      .finally(() => {
        setIsLoading(false);
      })
  };

  return (
    <>
      <Helmet>
        <title>Emprendimiento | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos/:id" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-16 px-10">
        <div className="w-full min-h-screen">
          <Typography variant='h2' color='teal'>Calificaciones</Typography>
          {isLoading ? (
          <div>Cargando...</div>
          ) : reviewsList.length > 0 ? (
          <div className="p-2 w-full text-gray-700 bg-white shadow-md rounded-xl ">
            <table className="text-left table-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 w-1/12">Fecha</th>
                  <th className="py-2 px-4 w-1/4">Nombre</th>
                  <th className="py-2 px-4 w-1/12">Rating</th>
                  <th className="py-2 px-4 ">Comentario</th>
                </tr>
              </thead>
              <tbody>
                {reviewsList.map((review, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">{review.Date}</td>
                    <td className="py-2 px-4">{review.FullName}</td>
                    <td className="py-2 px-4">{review.Rating}</td>
                    <td className="py-2 px-4">{review.Comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ) : (
            <div>No se encontraron calificaciones realizadas de este emprendimiento.</div>
        )}
        </div>
      </main>
    </>
  );
}
