import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "@material-tailwind/react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Signup() {
  const [data, setData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);

  // Function to handle the change of the password and confirm password inputs
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    // Check if the password and confirm password match
    if (data.confirmPassword !== undefined && data.confirmPassword !== "") {
      const password = name === "password" ? value : data.password;
      const confirmPassword =
        name === "confirmPassword" ? value : data.confirmPassword;
      setIsPasswordMismatch(password !== confirmPassword);
    }
  };

  // Function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
  };

  return (
    <>
      <main className="w-full max-w-7xl space-y-16 p-10">
        <h1 className="text-center font-sans text-2xl font-bold text-teal-900 sm:text-3xl lg:text-5xl">
          Registrarse
        </h1>
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-row gap-4 max-sm:flex-col"> 
            <Input
              type="text"
              label="Nombre"
              color="teal"
              size="lg"
              required={true}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="!border-2 "
              autoComplete="given-name"
            />
            <Input
              type="text"
              label="Apellidos"
              color="teal"
              size="lg"
              required={true}
              onChange={(e) => setData({ ...data, lastname: e.target.value })}
              className="!border-2"
              autoComplete="family-name"
            />
          </div>

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
              name="password"
              label="Contraseña"
              color="teal"
              size="lg"
              required={true}
              onChange={handlePasswordChange}
              className="!border-2 pr-10"
              autoComplete="new-password"
            />
            <FontAwesomeIcon
              icon={togglePassword ? faEyeSlash : faEye}
              className="absolute right-3 top-3 cursor-pointer rounded text-teal-600 hover:text-teal-900"
              onClick={() => setTogglePassword(!togglePassword)}
            />
          </div>
          <div className="relative flex w-full">
            <Input
              type={toggleConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              label="Confirmar contraseña"
              color="teal"
              size="lg"
              required={true}
              error={isPasswordMismatch}
              onChange={handlePasswordChange}
              className="!border-2 pr-10"
              autoComplete="new-password"
            />
            <FontAwesomeIcon
              icon={toggleConfirmPassword ? faEyeSlash : faEye}
              className="absolute right-3 top-3 cursor-pointer rounded text-teal-600 hover:text-teal-900"
              onClick={() => setToggleConfirmPassword(!toggleConfirmPassword)}
            />
          </div>
          <Button color="teal" size="lg" className="w-full" type="submit">
            Registrarse
          </Button>

          <p className="w-full text-center text-gray-500">
            ¿Ya estás registrado?{" "}
            <Link
              to="/iniciar-sesion"
              className="text-teal-600 hover:text-teal-900 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </main>
    </>
  );
}
