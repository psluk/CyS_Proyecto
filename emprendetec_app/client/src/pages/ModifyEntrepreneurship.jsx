import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import UseAxios from "../config/customAxios.js";
import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
  Spinner,
  Switch,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  List,
  ListItem,
} from "@material-tailwind/react";
import { validateImages } from "../../../common/utils/validations";
import { Helmet } from "react-helmet-async";
import { useSession } from "../context/SessionContext";
import { toast } from "react-toastify";
import {
  uploadFilesAndGetDownloadURLs,
  deleteImageByUrl,
} from "../config/firebase-config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { defaultError } from "../utils/ErrorSettings.js";
import { MapContainer, Popup, TileLayer } from "react-leaflet";
import "../styles/leaflet.css";
import { defaultZoom, tecCoordinates } from "../constants/mapData.js";
import DraggableMarker from "../components/DraggableMarker.jsx";
import CustomMapMarker from "../components/CustomMapMarker.js";
import { analytics } from "../config/firebase-config.js";
import { logEvent } from "firebase/analytics";
export default function CreateEntrepreneurship() {
  const axios = UseAxios();
  const { getUserEmail, loading } = useSession();

  const [formData, setFormData] = useState({
    projectID: 0,
    name: "",
    description: "",
    userEmail: "",
    location: "",
    latitude: null,
    longitude: null,
    building_number: null,
  });
  const [post, setPost] = useState([]);
  const [images, setImages] = useState([]);
  const params = useParams();
  const [selectedImages, setSelectedImagesURL] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [inPerson, setInPerson] = useState(false);
  const [locations, setLocations] = useState([]);
  const [isSelectingPlace, setIsSelectingPlace] = useState(false);
  const [isSearchingPlace, setIsSearchingPlace] = useState(false);
  const mapPopupRef = useRef(null);
  useEffect(() => {
    if (!loading) {
      fetchPost();
      fetchImages();
    }
  }, [loading]);

  const [activeImage, setActiveImage] = useState(
    <FontAwesomeIcon icon={faFile} beat size="2xl" />,
  );
  const [loading2, setLoading] = useState(false);
  const fileInputRef = useRef();

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
        const imagesArray = [];
        for (let i = 0; i < response.data.images.length; i++) {
          if (i === 0) {
            setActiveImage(response.data.images[i].original);
          }
          imagesArray.push(response.data.images[i].original);
        }
        setImages(response.data.images);
        setSelectedImagesURL(imagesArray);
        setSelectedFiles(response.data.images);
      }
    } catch (error) {
      console.error("Error al obtener las imagenes:", error);
    }
  };

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
    setFormData((prevFormData) => ({
      ...prevFormData,
      projectID: params.id,
    }));
  };

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var uploadedImageUrls = [];
    setLoading(true);
    if (selectedFiles.length === 0) {
      toast.error("No se han seleccionado imágenes.");
      setLoading(false);
    } else {
      const areImagesModified = !arraysEqual(selectedFiles, images);
      if (!areImagesModified) {
        toast.info("No se han realizado cambios en las imágenes.");
        uploadedImageUrls = selectedFiles;
      } else {
        try {
          for (const imageUrl of images) {
            await deleteImageByUrl(imageUrl.original);
          }
          uploadedImageUrls =
            await uploadFilesAndGetDownloadURLs(selectedFiles);
          toast.success("Imágenes actualizadas correctamente.");
        } catch (error) {
          toast.error("Error al actualizar las imágenes.");
        }
      }

      formData.images = uploadedImageUrls;

      setLoading(false);

      axios
        .put("/api/emprendimientos/modificar", formData)
        .then(() => {
          toast.success("¡Emprendimiento actualizado exitosamente!");
          if (analytics) {
            logEvent(analytics, "update_entrepreneurship", {
              name: formData.name,
              description: formData.description,
              userEmail: formData.userEmail,
              location: formData.building_number
                ? `${formData.building_number} - ${formData.location}`
                : formData.location,
            });
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message ?? defaultError);
        });
    }
  };

  const handlePlaceSearch = async (e) => {
    e.preventDefault();
    const searchedLocation = formData.location;
    setIsSearchingPlace(true);

    axios
      .get(`/api/lugares/buscar/${searchedLocation}`)
      .then((response) => {
        const loadedLocations = response.data?.results ?? [];
        setLocations(loadedLocations);

        if (loadedLocations.length === 0) {
          toast.error(
            "No se encontraron lugares. Intentá con otro término de búsqueda o por número de edificio.",
          );
        } else {
          if (loadedLocations.length === 1) {
            const location = loadedLocations[0];
            setFormData({
              ...formData,
              location: location.name,
              latitude: location.latitude,
              longitude: location.longitude,
              building_number: location.building_number,
            });
          } else {
            setIsSelectingPlace(true);
          }
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? defaultError);
      })
      .finally(() => {
        setIsSearchingPlace(false);
      });
  };

  useEffect(() => {
    if (!inPerson) {
      setFormData({
        ...formData,
        location: "",
        latitude: null,
        longitude: null,
        building_number: null,
      });
    }
  }, [inPerson]);

  return (
    <>
      <Helmet>
        <title>Modificar emprendimiento | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos/crear" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-12 px-6">
        <div className="flex w-full flex-col items-center justify-start bg-white p-2 md:p-4 lg:p-6">
          <div>
            {loading2 && (
              <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50">
                <Spinner color="blue" />
              </div>
            )}
            {
              <Card
                color="transparent"
                shadow={false}
                className="max-w-screen-sm"
              >
                <h1 className="mb-4 text-center text-xl font-semibold text-teal-600 md:text-2xl lg:text-3xl">
                  Modificar emprendimiento
                </h1>
                <Typography
                  color="gray"
                  className="mb-5 text-center font-normal"
                >
                  Por favor, proporcioná tus datos para la modificación de un
                  emprendimiento.
                </Typography>
                <div className="mb-5 grid w-full gap-4 object-center">
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
                  className="dropzone flex min-h-20 w-full cursor-pointer items-center justify-center rounded-xl border border-blue-gray-300/50 bg-blue-gray-50 px-4 shadow-lg"
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
                    Arrastrá y soltá tus imágenes aquí, o hacé clic para
                    seleccionar imágenes.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="mb-2 mt-8 w-full">
                  <div className="mb-1 flex flex-col gap-6">
                    <Input
                      size="lg"
                      variant="outlined"
                      type="text"
                      name="name"
                      required={true}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={post.Title}
                      label="Nombre del emprendimiento"
                    />
                    <Textarea
                      variant="outlined"
                      name="description"
                      required={true}
                      value={formData.description}
                      onChange={handleInputChange}
                      label="Descripción del emprendimiento"
                    />
                    <Switch
                      label="Presencial"
                      onChange={(e) => setInPerson(e.target.checked)}
                      value={inPerson}
                      color="teal"
                    />
                    {inPerson && (
                      <>
                        <div className="flex w-full items-center gap-2">
                          <Input
                            size="lg"
                            type="text"
                            name="location"
                            required={true}
                            value={formData.location}
                            onChange={(e) => {
                              // Close popup if closed
                              if (mapPopupRef.current) {
                                mapPopupRef.current._closeButton?.click();
                              }
                              setFormData({
                                ...formData,
                                building_number: null,
                              });
                              handleInputChange(e);
                            }}
                            label="Ubicación"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handlePlaceSearch(e);
                              }
                            }}
                            placeholder="Nombre o número de edificio"
                          />
                          <IconButton
                            variant="text"
                            onClick={handlePlaceSearch}
                            disabled={isSearchingPlace}
                          >
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                          </IconButton>
                        </div>
                        <div className="w-full overflow-hidden rounded-xl border-2 border-gray-300 [&>.leaflet-container]:h-96">
                          <MapContainer
                            center={tecCoordinates}
                            zoom={defaultZoom}
                            scrollWheelZoom={true}
                            className={"h-full w-full"}
                          >
                            <TileLayer
                              attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {formData.latitude && formData.longitude && (
                              <DraggableMarker
                                position={[
                                  formData.latitude,
                                  formData.longitude,
                                ]}
                                setPosition={(position) => {
                                  setFormData({
                                    ...formData,
                                    latitude: position.lat,
                                    longitude: position.lng,
                                  });
                                }}
                                icon={CustomMapMarker}
                              >
                                <Popup ref={mapPopupRef}>
                                  {formData.building_number && (
                                    <>
                                      <span className="font-bold">
                                        {formData.building_number}
                                      </span>
                                      <span className="px-1 font-bold">·</span>
                                    </>
                                  )}
                                  {formData.location}
                                </Popup>
                              </DraggableMarker>
                            )}
                          </MapContainer>
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    color="teal"
                    size="lg"
                    className="mt-5 w-full justify-center"
                    type="submit"
                    variant="gradient"
                  >
                    Modificar emprendimiento
                  </Button>
                </form>
              </Card>
            }
          </div>
        </div>
        <Dialog
          size="xs"
          open={isSelectingPlace}
          handler={() => setIsSelectingPlace(false)}
          className="flex max-h-[calc(100vh-5rem)] w-full flex-col"
        >
          <DialogHeader className="text-teal-700">
            Seleccionar lugar
          </DialogHeader>
          <DialogBody className="flex flex-col overflow-y-auto !px-5 !pt-0">
            <Typography className="mb-5 text-sm">
              Se encontraron {locations.length} resultados durante la búsqueda.
            </Typography>
            <List className="overflow-y-auto">
              {locations.map((location, index) => (
                <ListItem
                  key={index}
                  className="w-full text-start active:p-3"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      location: location.name,
                      latitude: location.latitude,
                      longitude: location.longitude,
                      building_number: location.building_number,
                    });
                    setIsSelectingPlace(false);
                  }}
                >
                  {location.building_number && (
                    <>
                      <span className="font-bold">
                        {location.building_number}
                      </span>
                      <span className="px-1 font-bold">·</span>
                    </>
                  )}
                  {location.name}
                </ListItem>
              ))}
            </List>
          </DialogBody>
        </Dialog>
      </main>
    </>
  );
}
