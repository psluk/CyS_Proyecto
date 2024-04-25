import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
  Spinner,
} from "@material-tailwind/react";
import { Helmet } from "react-helmet-async";
import { useSession } from "../context/SessionContext";
import { toast } from "react-toastify";
import { uploadFilesAndGetDownloadURLs } from "../config/firebase-config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";


export default function CreateEntrepreneurship() {
  const { getUserEmail } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    userEmail: "",
    // Otros campos de formData aquí
  });

  const [selectedImages, setSelectedImagesURL] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_IMAGE_COUNT = 5;

  const [activeImage, setActiveImage] = useState(
    <FontAwesomeIcon icon={faFile} beat size="2xl" />,
  );
  const [loading, setLoading] = useState(false);
  //////////////////////////
  const fileInputRef = useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (files) => {
    // Valida que no se hayan seleccionado más de 5 imágenes
    if (files.length > 5) {
      alert("No puedes seleccionar más de 5 imágenes");
      return;
    }

    const imagesArray = [];
    for (let i = 0; i < files.length; i++) {
      // Valida que cada imagen no pese más de 1 MB
      if (files[i].size > 1024 * 1024) {
        alert("Cada imagen no debe pesar más de 1 MB");
        return;
      }

      // Valida que cada imagen sea de formato JPEG
      if (files[i].type !== "image/jpeg") {
        alert("Solo se aceptan imágenes en formato JPEG");
        return;
      }

      if (i == 0) {
        setActiveImage(URL.createObjectURL(files[i]));
      }
      imagesArray.push(URL.createObjectURL(files[i]));
    }

    setSelectedImagesURL(imagesArray);
    setSelectedFiles(files);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };
  //////////////////////////

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    const email = getUserEmail();
    setFormData((prevFormData) => ({
      ...prevFormData,
      userEmail: email,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    const uploadedImageUrls =
      await uploadFilesAndGetDownloadURLs(selectedFiles);
    formData.images = uploadedImageUrls;
    console.log("URLs de descarga de las imágenes:", uploadedImageUrls);
    console.log("Datos del formulario:", formData);

    try {
      const createProjectResponse = await axios.post(
        "/api/emprendimientos/crear",
        formData,
      );
      setLoading(false);
      toast.success("¡Emprendimiento creado exitosamente!");
    } catch (error) {
      setLoading(false);
      toast.error("Ocurrió un error: " + error.message);
    }
  };

  return (
    
    <div className="min-h-screen w-full flex-col items-start justify-start bg-white p-2 md:p-2 lg:p-16">
      <Helmet>
        <title>Crear emprendemiento | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos/crear" />
      </Helmet>
      <div>
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner color="blue" />
        </div>
      )}
      { <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            Publicar emprendimiento
          </Typography>
          <Typography color="gray" className="mb-5 mt-1 font-normal">
            Encantado de conocerte. Por favor, proporciona tus datos para la
            creación de un emprendimiento.
          </Typography>
          <div className="w-12/12 md:w-12/12 mb-5 grid gap-4 object-center lg:w-6/12 ">
            <div className="flex justify-center items-center ">
              {typeof activeImage === "string" ? (
                <img
                  className="h-auto w-full max-w-full rounded-lg object-cover object-center"
                  src={activeImage}
                  alt=""
                />
              ) : (
                activeImage
              )}
            </div>
            <div className="grid aspect-auto grid-cols-5 gap-1">
              {selectedImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    onClick={() => setActiveImage(image)}
                    className="h-20 w-auto max-w-full cursor-pointer rounded-lg object-cover object-center"
                    alt={`Image ${index}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            className="dropzone flex h-20 cursor-pointer items-center justify-center rounded-md border-2 border-black shadow-2xl  lg:w-6/12"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              className="file-input h-full w-full opacity-0"
              type="file"
              multiple
              accept="image/jpeg, image/png"
              onChange={(e) => handleFiles(e.target.files)}
              style={{ display: "none" }}
            />
            <p>
              Arrastra y suelta tus imágenes aquí, o haz clic para seleccionar
              imágenes
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96"
          >
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Nombre del emprendimiento
              </Typography>
              <Input
                size="lg"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter venture name"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
               <Typography variant="h6" color="blue-gray" className="-mb-3">
                Descripción del emprendimiento
              </Typography>
              <Textarea
                variant="outlined"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter venture description"
              />
            </div>
            <Button
              color="teal"
              size="lg"
              className="w-full justify-center"
              type="submit"
              variant="gradient"
            >
              Publicar emprendimiento
            </Button>
          </form>
        </Card>}
    </div>
    </div>
  );
}
