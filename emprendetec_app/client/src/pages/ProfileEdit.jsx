import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { useSession } from "../context/SessionContext";
import UseAxios from "../config/customAxios.js";
import { toast } from "react-toastify";
import { validateImages, validatePassword, passwordRequirements } from "../../../common/utils/validations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uploadFilesAndGetDownloadURLs } from "../config/firebase-config.js";
import {
  faCheck,
  faEye,
  faEyeSlash,
  faQuestion,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { analytics } from "../config/firebase-config";
import { logEvent } from "firebase/analytics";

const ProfileEdit = () => {
  const axios = UseAxios();
  const navigate = useNavigate();

  const [togglePassword, setTogglePassword] = useState(false);
  const [togglePasswordConfirmation, setTogglePasswordConfirmation] =
    useState(false);
  const { getUserID, loading } = useSession();
  const [ userId, setUserID ] = useState(null);
  const [ givenName, setGivenName ] = useState('');
  const [ familyName, setFamilyName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ userImage, setUserImage ] = useState('/default/perfil.png');
  const [ file, setFile ] = useState(null);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(true);
  const [checkPasswordConfirmation, setCheckPasswordConfirmation] = useState(false);
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(null);
  
  useEffect(() => {
    if (userId){
      fetchUser();
    }
  }, [userId]);

  useEffect(() => {
    if (!loading){
      setUserID(getUserID());
    }
  }, [loading])

  useEffect(() => {
    setIsPasswordMismatch(password !== confirmPassword);
    if (
      confirmPassword.length === password.length &&
      confirmPassword.length > 0
    ) {
      // If autocompleted, etc.
      setCheckPasswordConfirmation(true);
    }
  }, [password, confirmPassword]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/usuarios/${userId}`);
      if (response.data && response.data.user) {
        setGivenName(response.data.user[0].GivenName);
        setFamilyName(response.data.user[0].FamilyName);
        setEmail(response.data.user[0].Email);
        if (response.data.user[0].ImageUser != null) {
          setUserImage(response.data.user[0].ImageUser);
        }
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(value);

    if (name === "password") {
      setIsPasswordInvalid(!validatePassword(value).isValid);
    }
  };

  const handleFile = (file) => {
    // Valida las imágenes usando la función validateImages
    const validationResult = validateImages(file);
    if (!validationResult.isValid) {
      // Si hay errores, muestra los mensajes de error y detiene el proceso
      toast.error(validationResult.errors.join("\n"));
      return;
    }

    setUserImage(URL.createObjectURL(file));
    setFile(file);
  };

  const getImage = async () => {
    if (file) {
      const uploadedImageUrls = await uploadFilesAndGetDownloadURLs([file]);
      console.log("uploading image: " + uploadedImageUrls[0])
      return uploadedImageUrls[0];
    }
    else {
      return null;
    }
  }

  const updateUser = async (e) => {
    console.log("Handle Submit")
    e.preventDefault();
    try {
      if (givenName === '' || familyName === ''){
        toast.error("El nombre y apellido no pueden quedar vacíos");
        return -1;
      }
      if ((isPasswordInvalid || isPasswordMismatch) && (password != '' || confirmPassword != '')){
        toast.error("Corregí los errores en las contraseñas y volvé a intentarlo");
        return -1;
      }
      const uploadedImageUrl = await getImage();
      const response = axios.put("/api/usuarios/editar-perfil", { email:email, givenName: givenName, familyName: familyName, password: password, image: uploadedImageUrl});
      console.log("Respuesta: " + response.data);
      return 1;
    } catch (error) {
      console.error("Error con los datos:", error);
      return -1;
    }
  };

  const handleSubmit = async (e) => {
    const res = updateUser(e)
    if (res != 1){
        toast.success("Actualización realizada con éxito.")
        toast.info("Si no ve los cambios actualice la página")
        navigate('/perfil')
    }
  };

  return (
    <>
      <Helmet>
        <title>Modificar Perfil | EmprendeTEC</title>
        <link rel="canonical" href="/perfil/editar" />
      </Helmet>
      <main className="w-full max-w-7xl px-10">
        <Typography variant='h2' color='teal'>Modificar Perfil</Typography>
        <div className="md:w-2/3 shadow rounded mb-3 p-5">
          <div className="flex justify-between">
              <div className="w-1/2">
                  <div className="mb-4">
                      <Input
                          value={givenName}
                          label="Nombre"
                          placeholder="Ingrese su nombre"
                          color="teal"
                          onChange={(e) => setGivenName(e.target.value)}
                      />
                  </div>
                  <div className="mb-4">
                      <Input
                          value={familyName}
                          label="Apellidos"
                          placeholder="Ingrese su apellido"
                          color="teal"
                          onChange={(e) => setFamilyName(e.target.value)}
                      />
                  </div>
                  <div className="mb-4">
                      <Typography color="gray" className="font-bold">Correo:</Typography>
                      <Typography color="gray" className="ml-4">{email}</Typography>
                  </div>
                  <div>
                      <Input
                          value={password}
                          name="password"
                          label="Contraseña"
                          placeholder="Deje en blanco si no desea cambiar la contraseña"
                          color="teal"
                          type="password"
                          onChange={handlePasswordChange}
                      />
                  </div>
                  <FontAwesomeIcon
                        icon={togglePassword ? faEyeSlash : faEye}
                        className="absolute right-3 top-3 cursor-pointer rounded text-teal-600 hover:text-teal-900"
                        onClick={() => setTogglePassword(!togglePassword)}
                      />
                      <ul className="w-full lg:px-10 py-2">
                        {passwordRequirements.map((requirement, index) => {
                          const isMet = requirement.validate(password);
                          return (
                            <li key={index} className="text-sm">
                              <FontAwesomeIcon
                                icon={isMet ? faCheck : faXmark}
                                className={`${isMet ? "text-green-700" : "text-red-500"} inline-block w-3 pe-2`}
                              ></FontAwesomeIcon>
                              {requirement.label}
                            </li>
                          );
                        })}
                      </ul>
                  <div className="mb-6">
                      <Input
                          value={confirmPassword}
                          name="passwordConfirmation"
                          label="Confirma contraseña"
                          placeholder="Deje en blanco si no desea cambiar la contraseña"
                          color="teal"
                          type="password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <FontAwesomeIcon
                        icon={togglePasswordConfirmation ? faEyeSlash : faEye}
                        className="absolute right-3 top-3 cursor-pointer rounded text-teal-600 hover:text-teal-900"
                        onClick={() =>
                          setTogglePasswordConfirmation(!togglePasswordConfirmation)
                        }
                      />
                      <ul className="w-full lg:px-10 py-2">
                        <li className="text-sm">
                          <FontAwesomeIcon
                            icon={
                              !checkPasswordConfirmation
                                ? faQuestion
                                : !isPasswordMismatch
                                  ? faCheck
                                  : faXmark
                            }
                            className={`${!checkPasswordConfirmation ? "text-light-blue-700" : !isPasswordMismatch ? "text-green-700" : "text-red-500"} inline-block w-3 pe-2`}
                          ></FontAwesomeIcon>
                          Las contraseñas coinciden
                        </li>
                      </ul>
                      
                  </div>
                  {/* </form> */}
              </div>
              <div className="flex flex-col items-center lg:w-1/2" htmlFor="profileimg">
                  <img className="size-24 md:size-36 lg:size-56 rounded-2xl mb-2" src={userImage}/>
                  <label className="flex cursor-pointer" htmlFor="profileimg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                      Subir archivo
                  </label>
                  <input 
                    type="file"
                    id="profileimg"
                    accept="image/jpeg, image/png"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}></input>
              </div>
          </div>
          <Button
            className="flex m-auto bg-teal-500 hover:bg-teal-700 text-white font-bold px-4"
            onClick={handleSubmit}
          >
            Confirmar cambios
          </Button>
        </div>
      </main>
    </>
  );
};

export default ProfileEdit;
