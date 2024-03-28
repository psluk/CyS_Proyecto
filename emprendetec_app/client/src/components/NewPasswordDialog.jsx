import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import {
  passwordRequirements,
  validatePassword,
} from "../../../common/utils/validations";
import {
  faCheck,
  faEye,
  faEyeSlash,
  faQuestion,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getAuth,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";

import { useSession } from "../context/SessionContext";

export default function NewPasswordDialog({ oobCode, open, handler }) {
  const navigate = useNavigate();
  const { login } = useSession();
  const auth = getAuth();
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirmation: "",
  });
  const [togglePassword, setTogglePassword] = useState(false);
  const [togglePasswordConfirmation, setTogglePasswordConfirmation] =
    useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(true);
  const [checkPassword, setCheckPassword] = useState(false);
  const [checkPasswordConfirmation, setCheckPasswordConfirmation] =
    useState(false);
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (isPasswordInvalid || isPasswordMismatch) {
      toast.error("Corregí los errores en el formulario y volvé a intentarlo");
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        const accountEmail = email;

        confirmPasswordReset(auth, oobCode, formData.password)
          .then((resp) => {
            toast.success("La contraseña se ha actualizado correctamente.");
            login(accountEmail, formData.password)
              .then(() => {
                navigate("/");
              })
              .finally(() => {
                setSubmitting(false);
              });
          })
          .catch((error) => {
            toast.error(
              "El enlace de recuperación de contraseña es inválido o ha expirado. Solicitá uno nuevo.",
            );
          });
      })
      .catch((error) => {
        toast.error(
          "El enlace de recuperación de contraseña es inválido o ha expirado. Solicitá uno nuevo.",
        );
      });
  };

  return (
    <Dialog open={open} handler={handler}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>Recuperar contraseña</DialogHeader>
        <DialogBody>
          <p>Digitá tu nueva contraseña a continuación.</p>
          <div className="relative flex w-full flex-wrap pt-5">
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
              className="absolute right-3 top-8 cursor-pointer rounded text-teal-600 hover:text-teal-900"
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
          <div className="relative flex w-full flex-wrap pt-5">
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
              className="absolute right-3 top-8  cursor-pointer rounded text-teal-600 hover:text-teal-900"
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
        </DialogBody>
        <DialogFooter>
          <Button color="teal" type="submit" loading={submitting}>
            Registrar nueva contraseña
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
