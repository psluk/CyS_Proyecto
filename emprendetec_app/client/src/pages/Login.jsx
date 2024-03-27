import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@material-tailwind/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "../context/SessionContext";
import { defaultError } from "../utils/ErrorSettings";
import { toast } from "react-toastify";

export default function Login() {
  const [formData, setFormData] = useState({});
  const [togglePassword, setTogglePassword] = useState(false);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { login } = useSession();

  // Function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    login(formData.email, formData.password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error.code);
        const errorCode = error.code;
        let message = defaultError;

        switch (errorCode) {
          case "auth/user-not-found":
            message = "El correo electrónico no está registrado.";
            break;

          case "auth/wrong-password":
            message = "La contraseña es incorrecta.";
            break;

          case "auth/invalid-email":
            message = "El correo electrónico es inválido.";
            break;

          case "auth/user-disabled":
            message = "La cuenta está deshabilitada.";
            break;

          case "auth/invalid-credential":
            message = "El usuario o la contraseña son incorrectos.";
            break;

          case "auth/too-many-requests":
            message =
              "Demasiados intentos fallidos. Restablecé tu contraseña o intentá más tarde.";
            break;

          default:
            break;
        }

        toast.error(message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <main className="w-full max-w-7xl space-y-16 px-10">
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            containerProps={{ className: "" }}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            autoComplete="current-password"
          />
          <FontAwesomeIcon
            icon={togglePassword ? faEyeSlash : faEye}
            className="absolute right-3 top-3 cursor-pointer rounded text-teal-600 hover:text-teal-900"
            onClick={() => setTogglePassword(!togglePassword)}
          />
        </div>

        <Button
          color="teal"
          size="lg"
          className="w-full justify-center"
          type="submit"
          loading={submitting}
          variant="gradient"
        >
          Iniciar sesión
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
  );
}
