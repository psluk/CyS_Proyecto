import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Typography, Input, Card, Button } from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from "../context/SessionContext";
import axios from "axios";
import { toast } from "react-toastify";

const ProfileEdit = () => {
  const navigate = useNavigate();

  const { getUserID } = useSession();
  const [user, setUser] = useState([])
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userImage, setUserImage] = useState('/default/perfil.png');
  
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/usuarios/${getUserID()}`);
      if (response.data && response.data.user) {
        setUser(response.data.user[0]);
        setGivenName(response.data.user[0].GivenName);
        setFamilyName(response.data.user[0].FamilyName);
        setEmail(response.data.user[0].Email);
        if (response.data.user[0].ImageUser != null){
          setUserImage(response.data.user[0].ImageUser);
        }
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Hubo cambios
      if (givenName != user.GivenName || familyName != user.FamilyName ||
          (userImage != user.ImageUser && userImage != '/iconos/perfil.png')){
            if (givenName === '' || familyName === ''){
                toast.error("El nombre y apellido no pueden quedar vacíos");
                //alert("El nombre y apellido no pueden quedar vacíos");
                return -1;
            }
            const response = await axios.put("/api/usuarios/editar-perfil", { email:email, givenName: givenName, familyName: familyName, password: password, image: userImage});
            console.log(response.data);
            navigate('/perfil');
      }
      return 1;
    } catch (error) {
      console.error("Error con los datos:", error);
      return -1;
    }
  };

  const handleSubmit2 = async (e) => {
    const res = updateUser(e)
    if (res != -1){
        navigate('/perfil')
    }
  };

  return (
    <>
      <Helmet>
        <title>Prueba | EmprendeTEC</title>
        <link rel="canonical" href="/perfil/editar" />
      </Helmet>
      <Typography variant='h2' color='teal' className="mt-24">Modificar Perfil</Typography>
      <div className="w-2/3 shadow rounded mb-3 px-8 py-6">
        <div className="flex justify-between">
            <div className="mb-4 w-1/2">
                {/* <form
                    onSubmit={handleSubmit}
                    className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96"
                > */}
                <div className="mb-4">
                    <Typography color="gray" className="font-bold">Nombre:</Typography>
                    <Input
                        value={givenName}
                        placeholder="Ingrese su nombre"
                        color="teal"
                        onChange={(e) => setGivenName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Typography color="gray" className="font-bold">Apellidos:</Typography>
                    <Input
                        value={familyName}
                        placeholder="Ingrese su apellido"
                        color="teal"
                        onChange={(e) => setFamilyName(e.target.value)}
                        required
                    />
                </div>
                {/* <div className="mb-4">
                    <Typography color="gray" className="font-bold">Teléfono:</Typography>
                    <Input
                        value={phone}
                        placeholder="Ingrese su número de teléfono"
                        color="teal"
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div> */}
                <div className="mb-4">
                    <Typography color="gray" className="font-bold">Correo:</Typography>
                    <Typography color="gray" className="ml-4">{email}</Typography>
                </div>
                <div className="mb-4">
                    <Typography color="gray" className="font-bold">Contraseña:</Typography>
                    <Input
                        value={password}
                        placeholder="Deje en blanco si no desea cambiar la contraseña"
                        color="teal"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <Typography color="gray" className="font-bold">Confirma contraseña:</Typography>
                    <Input
                        value={confirmPassword}
                        placeholder="Deje en blanco si no desea cambiar la contraseña"
                        color="teal"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {/* </form> */}
            </div>
            <div className="flex flex-col items-center w-1/2" htmlFor="profileimg">
                <img className="size-56 rounded-2xl mb-2" src={userImage}/>
                <label className="flex cursor-pointer" htmlFor="profileimg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Subir archivo
                </label>
                <input type="file" id="profileimg" className="hidden" onChange={(e) => setUserImage(URL.createObjectURL(e.target.files[0]))}></input>
            </div>
        </div>
        <Button
          className="flex m-auto bg-teal-500 hover:bg-teal-700 text-white font-bold px-4"
          onClick={handleSubmit}
        >
          Confirmar cambios
        </Button>
      </div>
    </>
  );
};


export default ProfileEdit;