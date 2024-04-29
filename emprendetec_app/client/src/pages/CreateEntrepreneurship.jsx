import { useState, useRef, useEffect } from "react";
import UseAxios from "../config/customAxios.js";
import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
  Spinner, Switch, IconButton, Dialog, DialogHeader, DialogBody, List, ListItem
} from "@material-tailwind/react";
import {
  validateImages,
} from "../../../common/utils/validations";
import { Helmet } from "react-helmet-async";
import { useSession } from "../context/SessionContext";
import { toast } from "react-toastify";
import { uploadFilesAndGetDownloadURLs } from "../config/firebase-config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { defaultError } from "../utils/ErrorSettings.js";
import { MapContainer, Popup, TileLayer } from "react-leaflet";
import "../styles/leaflet.css";
import { defaultZoom, tecCoordinates } from "../constants/mapData.js";
import DraggableMarker from "../components/DraggableMarker.jsx";
import CustomMapMarker from "../components/CustomMapMarker.js";

export default function CreateEntrepreneurship() {
  const axios = UseAxios();
  const { getUserEmail } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    userEmail: "",
    location: "",
    latitude: null,
    longitude: null,
    building_number: null,
  });

  const [selectedImages, setSelectedImagesURL] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [inPerson, setInPerson] = useState(false);
  const [locations, setLocations] = useState([]);
  const [isSelectingPlace, setIsSelectingPlace] = useState(false);
  const [isSearchingPlace, setIsSearchingPlace] = useState(false);
  const mapPopupRef = useRef(null);

  const [activeImage, setActiveImage] = useState(
    <FontAwesomeIcon icon={faFile} beat size="2xl" />,
  );
  const [loading, setLoading] = useState(false);
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
      setLoading(false);
      axios
        .post("/api/emprendimientos/crear", {
          ...formData,
          location: formData.building_number ? `${formData.building_number} - ${formData.location}` : formData.location
        })
        .then(() => {
          toast.success("¡Emprendimiento creado exitosamente!");
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

    axios.get(`/api/lugares/buscar/${searchedLocation}`).then((response) => {
      const loadedLocations = response.data?.results ?? [];
      setLocations(loadedLocations);

      if (loadedLocations.length === 0) {
        toast.error("No se encontraron lugares. Intentá con otro término de búsqueda o por número de edificio.");
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
    }).catch((error) => {
      toast.error(error?.response?.data?.message ?? defaultError);
    }).finally(() => {
      setIsSearchingPlace(false);
    });
  }

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
        <title>Crear emprendimiento | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos/crear" />
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
                  Publicar emprendimiento
                </Typography>
                <Typography color="gray" className="mb-5 mt-1 font-normal">
                  Encantado de conocerte. Por favor, proporciona tus datos para
                  la creación de un emprendimiento.
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
                    <Input
                      size="lg"
                      variant="outlined"
                      type="text"
                      name="name"
                      required={true}
                      value={formData.name}
                      onChange={handleInputChange}
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
                    {
                      inPerson && (
                        <>
                          <div className="flex w-full gap-2 items-center">
                            <Input
                              size="lg"
                              type="text"
                              name="location"
                              required={true}
                              value={formData.location}
                              onChange={(e) => {
                                // Close popup if closed
                                if (mapPopupRef.current) {
                                  console.log(mapPopupRef.current)
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
                            />
                            <IconButton variant="text" onClick={handlePlaceSearch} disabled={isSearchingPlace}>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </IconButton>
                          </div>
                          <div
                            className="w-full [&>.leaflet-container]:h-96 rounded-xl border-2 border-gray-300 overflow-hidden"
                          >
                            <MapContainer
                              center={tecCoordinates}
                              zoom={defaultZoom}
                              scrollWheelZoom={true}
                              className={"w-full h-full"}
                            >
                              <TileLayer
                                attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              {
                                formData.latitude && formData.longitude &&
                                <DraggableMarker
                                  position={[formData.latitude, formData.longitude]}
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
                                    {
                                      formData.building_number &&
                                      <>
                                        <span className="font-bold">
                                          {formData.building_number}
                                        </span>
                                        <span className="font-bold px-1">·</span>
                                      </>
                                    }
                                    {formData.location}
                                  </Popup>
                                </DraggableMarker>
                              }
                            </MapContainer>
                          </div>
                        </>
                      )
                    }
                  </div>
                  <Button
                    color="teal"
                    size="lg"
                    className="w-full justify-center mt-5"
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
        <Dialog
          size="xs"
          open={isSelectingPlace}
          handler={() => setIsSelectingPlace(false)}
          className="max-h-[calc(100vh-5rem)] flex flex-col w-full"
        >
          <DialogHeader className="text-teal-700">
            Seleccionar lugar
          </DialogHeader>
          <DialogBody className="!px-5 !pt-0 flex flex-col overflow-y-auto">
            <Typography className="text-sm mb-5">Se encontraron {locations.length} resultados durante la
              búsqueda.</Typography>
            <List className="overflow-y-auto">
              {
                locations.map((location, index) => (
                  <ListItem key={index} className="w-full text-start active:p-3" onClick={
                    () => {
                      setFormData({
                        ...formData,
                        location: location.name,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        building_number: location.building_number,
                      });
                      setIsSelectingPlace(false);
                    }
                  }
                  >
                    {
                      location.building_number &&
                      <>
                        <span className="font-bold">{location.building_number}</span>
                        <span className="font-bold px-1">·</span>
                      </>
                    }
                    {location.name}
                  </ListItem>
                ))
              }
            </List>
          </DialogBody>
        </Dialog>
      </main>
    </>
  );
}
