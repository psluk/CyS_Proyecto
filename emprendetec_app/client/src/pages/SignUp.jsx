import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "@material-tailwind/react";
import {
  faCheck,
  faEye,
  faEyeSlash,
  faQuestion,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { toast } from "react-toastify";
import { defaultError } from "../utils/ErrorSettings";
import {
  passwordRequirements,
  validatePassword,
} from "../../../common/utils/validations";

export default function Signup() {
  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [togglePassword, setTogglePassword] = useState(false);
  const [togglePasswordConfirmation, setTogglePasswordConfirmation] =
    useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(true);
  const [checkPassword, setCheckPassword] = useState(false);
  const [checkPasswordConfirmation, setCheckPasswordConfirmation] =
    useState(false);
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Function to handle the change of the password and confirm password inputs
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setIsPasswordInvalid(!validatePassword(value).isValid);
    }
  };

  useEffect(() => {
    setIsPasswordMismatch(formData.password !== formData.passwordConfirmation);
    if (
      formData.passwordConfirmation.length === formData.password.length &&
      formData.passwordConfirmation.length > 0
    ) {
      // If autocompleted, etc.
      setCheckPasswordConfirmation(true);
    }
  }, [formData.password, formData.passwordConfirmation]);

  // Function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    axios
      .post("/api/usuarios/registro", formData)
      .then(() => {
        toast.success("¡Usuario registrado exitosamente!");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? defaultError);
        setIsEmailInvalid(
          error?.response?.data?.message.toLowerCase().includes("correo"),
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
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
            onChange={(e) =>
              setFormData({ ...formData, givenName: e.target.value })
            }
            className="!border-2"
            autoComplete="given-name"
          />
          <Input
            type="text"
            label="Apellidos"
            color="teal"
            size="lg"
            required={true}
            onChange={(e) =>
              setFormData({ ...formData, familyName: e.target.value })
            }
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
          pattern=".+@(estudiantec\.cr|itcr\.ac\.cr|tec\.ac\.cr)"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="!border-2"
          autoComplete="email"
          error={isEmailInvalid}
        />
        <div className="relative flex w-full flex-wrap">
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
            error={checkPassword && isPasswordInvalid}
            onBlur={() => setCheckPassword(true)}
          />
          <FontAwesomeIcon
            icon={togglePassword ? faEyeSlash : faEye}
            className="absolute right-3 top-3 cursor-pointer rounded text-teal-600 hover:text-teal-900"
            onClick={() => setTogglePassword(!togglePassword)}
          />
          <ul className="w-full px-10 py-2">
            {passwordRequirements.map((requirement, index) => {
              const isMet = requirement.validate(formData.password);
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
        </div>
        <div className="relative flex w-full flex-wrap">
          <Input
            type={togglePasswordConfirmation ? "text" : "password"}
            name="passwordConfirmation"
            label="Confirmar contraseña"
            color="teal"
            size="lg"
            required={true}
            error={checkPasswordConfirmation && isPasswordMismatch}
            onChange={handlePasswordChange}
            className="!border-2 pr-10"
            autoComplete="new-password"
            onBlur={() => setCheckPasswordConfirmation(true)}
          />
          <FontAwesomeIcon
            icon={togglePasswordConfirmation ? faEyeSlash : faEye}
            className="absolute right-3 top-3 cursor-pointer rounded text-teal-600 hover:text-teal-900"
            onClick={() =>
              setTogglePasswordConfirmation(!togglePasswordConfirmation)
            }
          />
          <ul className="w-full px-10 py-2">
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
        <Button
          color="teal"
          size="lg"
          className="w-full justify-center"
          type="submit"
          loading={submitting}
          variant="gradient"
        >
          {submitting ? "Registrando..." : "Registrarse"}
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
  );
}
