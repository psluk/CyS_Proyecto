import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { Helmet } from "react-helmet-async";
import { useSession } from "../context/SessionContext";
import { toast } from "react-toastify";
import { uploadFilesAndGetDownloadURLs }  from "../config/firebase-config.js";

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
    "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const imagesArray = [];
    for (let i = 0; i < files.length; i++) {
      imagesArray.push(URL.createObjectURL(files[i]));
    }
    setSelectedImagesURL(imagesArray);
    setSelectedFiles(files);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedImageUrls =
      await uploadFilesAndGetDownloadURLs(selectedFiles);
    console.log("URLs de descarga de las imágenes:", uploadedImageUrls);
/*
    const userEmail = getUserEmail();
    setFormData((prevFormData) => ({
      ...prevFormData,
      userEmail, // Esto es equivalente a userEmail: userEmail
    }));

    try {
      const createProjectResponse = await axios.post(
        "/api/emprendimientos/crear",
        formData,
      );
      toast.success("¡Emprendimiento creado exitosamente!");
    } catch (error) {
      toast.error("Ocurrió un error: " + error.message);
    }
*/
  };

  return (
    <div className="min-h-screen w-full flex-col items-start justify-start bg-white p-2 md:p-2 lg:p-32">
      <Helmet>
        <title>Crear emprendemiento | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos/crear" />
      </Helmet>
      <>
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            Publicar emprendimiento
          </Typography>
          <Typography color="gray" className="mb-5 mt-1 font-normal">
            Encantado de conocerte. Por favor, proporciona tus datos para la
            creación de un emprendimiento.
          </Typography>
          <div className="w-12/12 md:w-12/12 mb-5 grid aspect-auto gap-4 object-left lg:w-6/12 ">
            <div>
              <img
                className="h-auto w-auto max-w-full rounded-lg object-cover object-center md:h-[480px]"
                src={activeImage}
                alt=""
              />
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
          <input
            multiple
            className="mt-6"
            type="file"
            label="Image input"
            accept="image/jpeg, image/png"
            id="images"
            onChange={handleImageChange}
          />
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
        </Card>
      </>
    </div>
  );
}
