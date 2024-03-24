import React from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "@material-tailwind/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [data, setData] = useState({});
  const [togglePassword, setTogglePassword] = useState(false);

  // Function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
  };


  return (
    <>
      <main className="w-full max-w-7xl space-y-16 p-10">
        <h1 className="text-center font-sans text-2xl font-bold text-teal-900 sm:text-3xl lg:text-5xl">
          Inicio de sesión
        </h1>
        <form className="w-full max-w-96 space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Correo institucional"
            color="teal"
            size="lg"
            required={true}
            pattern=".+@estudiantec.cr"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="!border-2"
            autoComplete="email"
          />
          <div className="relative flex w-full">
            <Input
              type={togglePassword ? "text" : "password"}
              label="Contraseña"
              color="teal"
              size="lg"
              required={true}
              className="!border-2 pr-10"
              containerProps={{className:""}}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              autoComplete="current-password"
            />
              <FontAwesomeIcon
                icon={ togglePassword? faEyeSlash: faEye}
                className="absolute right-3 top-3 cursor-pointer rounded text-teal-600 hover:text-teal-900"
                onClick={() => setTogglePassword(!togglePassword)}
              />
          </div>

          <Button color="teal" size="lg" className="w-full" type="submit">
            Iniciar Sesión
          </Button>

          <div className="w-full space-y-2 py-4">
            <p className="w-full text-center font-medium hover:underline">
              <Link>Olvidé mi contraseña</Link>
            </p>
            <p className="w-full text-center text-gray-500">
              ¿No tenés cuenta?{" "}
              <Link
                className="text-teal-600 hover:text-teal-900 hover:underline"
                to={"/registrarse"}
              >
                Registrarse
              </Link>
            </p>
          </div>
        </form>
      </main>
    </>
  );
}
