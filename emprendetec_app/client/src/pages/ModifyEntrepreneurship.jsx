import React, { useState, useRef, useEffect} from "react";
import UseAxios from "../config/customAxios.js";
import { useParams } from 'react-router-dom';
import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
  Spinner,
} from "@material-tailwind/react";
import {
  imageRequirements,
  validateImages,
} from "../../../common/utils/validations";
import { Helmet } from "react-helmet-async";
import { useSession } from "../context/SessionContext";
import { toast } from "react-toastify";
import { uploadFilesAndGetDownloadURLs } from "../config/firebase-config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

export default function CreateEntrepreneurship() {
  const axios = UseAxios();
  const { getUserEmail } = useSession();
  const { getUserID } = useSession();
  const [post, setPost] = useState([]);
    const [score, setScore] = useState(1);
    const [images, setImages] = useState([]);
    const params = useParams()
    const [selectedImages, setSelectedImagesURL] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_IMAGE_COUNT = 5;
    

  useEffect(() => {
    setScore(post.Score)
    fetchPost();
    fetchImages();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    userEmail: "",
  });

  const fetchPost = async () => {
      try {
          const response = await axios.get(`/api/emprendimientos/${params.id}`);
          
          if (response.data && response.data.post && response.data.post.length > 0) {
              setPost(response.data.post[0]);
              const newScore = Math.round(response.data.post[0].Score);
              setScore(4);
          }
      } catch (error) {
          console.error("Error al obtener el emprendimiento:", error);
      }
  };
  const fetchImages = async () => {
    try {
        const response = await axios.get(`/api/emprendimientos/imagenes/${params.id}`);
        
        if (response.data && response.data.images && response.data.images.length > 0) {
            const imagesArray = [];
            for (let i = 0; i < response.data.images.length; i++) {
                if (i === 0) {
                  setActiveImage(response.data.images[i].original);
                }
                imagesArray.push(response.data.images[i].original);
              }      
            setImages(response.data.images);
            setSelectedImagesURL(imagesArray);
        }
    } catch (error) {
        console.error("Error al obtener las imagenes:", error);
    }
  };


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

    // Valida las imágenes usando la función validateImages
    const validationResult = validateImages(files);
    if (!validationResult.isValid) {
      // Si hay errores, muestra los mensajes de error y detiene el proceso
      alert(validationResult.errors.join("\n"));
      return;
    }

    const imagesArray = [];
    for (let i = 0; i < files.length; i++) {
      if (i === 0) {
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
    if (selectedFiles.length === 0) {
      toast.error("No se han seleccionado imágenes.");
      setLoading(false);
    } else {
      const uploadedImageUrls =
        await uploadFilesAndGetDownloadURLs(selectedFiles);
      formData.images = uploadedImageUrls;
      console.log("URLs de descarga de las imágenes:", uploadedImageUrls);
      console.log("Datos del formulario:", formData);
      setLoading(false);
      axios
        .post("/api/emprendimientos/crear", formData)
        .then(() => {
          toast.success("¡Emprendimiento creado exitosamente!");
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message ?? defaultError);
        });
    }
  };

  return (
    <>
      <Helmet>
        <title>Modificar emprendemiento | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos/ModifyEntrepreneurship/:id" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-12 px-6">
        <div className="min-h-screen w-full flex-col items-start justify-start bg-white p-2 md:p-2 lg:p-16">
          <div>
            {loading && (
              <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50">
                <Spinner color="blue" />
              </div>
            )}
            {
              <Card color="transparent" shadow={false}>
                <Typography variant="h4" color="blue-gray">
                    Modificar emprendimiento
                </Typography>
                <Typography color="gray" className="mb-5 mt-1 font-normal">
                  Encantado de conocerte. Por favor, proporciona tus datos para modificar el emprendimiento.
                </Typography>
                <div className="w-12/12 md:w-12/12 mb-5 grid gap-4 object-center lg:w-6/12 ">
                  <div className="flex items-center justify-center ">
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
                    Arrastra y suelta tus imágenes aquí, o haz clic para
                    seleccionar imágenes
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96"
                >
                  <div className="mb-1 flex flex-col gap-6">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="-mb-3"
                    >
                      Nombre del emprendimiento
                    </Typography>
                    <Input
                      size="lg"
                      type="text"
                      name="name"
                      required={true}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder= {post.Title}
                      label="Nombre del emprendimiento"
                      className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="-mb-3"
                    >
                      Descripción del emprendimiento
                    </Typography>
                    <Textarea
                      variant="outlined"
                      name="description"
                      required={true}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={post.Title}
                      label="Descripción del emprendimiento"
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
            }
          </div>
        </div>
      </main>
    </>
  );
}
