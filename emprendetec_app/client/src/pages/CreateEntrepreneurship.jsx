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

export default function CreateEntrepreneurship() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [],
  });

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
    const files = Array.from(e.target.files);
    // Verificar el número de imágenes seleccionadas
  if (files.length > MAX_IMAGE_COUNT) {
    alert("No puedes seleccionar más de 5 imágenes");
    return;
  }

  // Verificar los formatos y tamaños de las imágenes
  files.forEach((file) => {
    if (!file.type.startsWith('image/')) {
      alert("Solo se permiten imágenes en formato JPEG o PNG");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert(`La imagen "${file.name}" es demasiado grande. Debe ser menor a 5MB`);
      return;
    }
  });
    const images = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      images,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formData.images.forEach((image) => {
        formDataToSend.append("images", image.file);
      });

      // Make a request to your server to handle the creation of the venture
      const response = await axios.post("/api/create-venture", formDataToSend);

      // Handle the response, e.g., show success message or redirect to another page
      console.log(response.data);
    } catch (error) {
      console.error("Error creating venture:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex-col items-start justify-start bg-white p-2 md:p-2 lg:p-32">
      <Helmet>
        <title>Panel de adminstración | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos/crear" />
      </Helmet>
      <>
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            Publicar emprendimiento
          </Typography>
          <Typography color="gray" className="mt-1 mb-5 font-normal">
            Encantado de conocerte. Por favor, proporciona tus datos para la
            creación de un emprendimiento.
          </Typography>
          <div className="grid gap-4 object-left w-12/12 md:w-12/12 lg:w-6/12 aspect-auto mb-5 ">
            <div>
              <img
                className="h-auto w-auto max-w-full rounded-lg object-cover object-center md:h-[480px]"
                src={activeImage}
                alt=""
              />
            </div>
            <div className="grid grid-cols-5 gap-1 aspect-auto">
              {formData.images.map((image, index) => (
                <div key={index}>
                  <img
                    onClick={() => setActiveImage(image.url)}
                    src={image.url}
                    className="h-20 w-auto max-w-full cursor-pointer rounded-lg object-cover object-center"
                    alt="gallery-image"
                  />
                </div>
              ))}
            </div>
          </div>

          <input
            className="mt-6"
            type="file"
            label="Email Address"
            accept="image/jpeg, image/png"
            multiple
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

            <Button type="submit">Create Venture</Button>
          </form>
        </Card>
      </>
    </div>
  );
}
