import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "../context/SessionContext";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { applyActionCode, getAuth, sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { useState } from "react";

export function ConfirmEmailVerification({ oobCode, open, handler }) {
  const [submitting, setSubmitting] = useState(false);
  const { getUserEmail } = useSession();
  const navigate = useNavigate();

  const handleSubmit = () => {
    setSubmitting(true);

    const auth = getAuth();
    applyActionCode(auth, oobCode)
      .then(() => {
        // Refresh token to update user claims
        auth.currentUser.getIdToken(true).then(() => {
          window.location.href = "/?showEmailVerificationSuccess"; // Refresh the page
        });
      })
      .catch(() => {
        toast.error("No se pudo verificar el correo electrónico. Verificá el enlace o solicitá uno nuevo.");
        navigate("/iniciar-sesion");
      })
      .finally(() => {
        handler();
        setSubmitting(false);
      });
  };

  return (
    <Dialog open={open} handler={handler}>
      <DialogHeader>Verificación de correo electrónico</DialogHeader>
      <DialogBody>
        Estás a punto de verificar el correo electrónico &quot;
        <strong>{getUserEmail()}</strong>&quot;.
        <br />
        ¿Continuar?
      </DialogBody>
      <DialogFooter>
        <Button
          color="teal"
          type="submit"
          loading={submitting}
          onClick={handleSubmit}
        >
          Verificar correo electrónico
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export const sendVerificationLink = (isSentAutomatically) => {
  const auth = getAuth();
  sendEmailVerification(auth.currentUser)
    .then(() => {
      const successMessage =
        "Se ha enviado un correo de verificación a tu dirección de correo electrónico.";
      if (isSentAutomatically) {
        toast.info(successMessage);
      } else {
        toast.success(successMessage);
      }
    })
    .catch(() => {
      if (isSentAutomatically) {
        toast.info(
          "Verificá tu correo electrónico con el enlace de la parte superior.",
        );
      } else {
        toast.error(
          "No se pudo enviar el correo de verificación. Intentá nuevamente más tarde.",
        );
      }
    });
};

export default function VerifyEmail() {
  const { user, isEmailVerified, loading } = useSession();

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (!isEmailVerified()) {
    return (
      <div className="mt-20 flex w-full items-center justify-center bg-yellow-300 px-10 py-2 text-center shadow-inner">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="inline-block pe-2 text-brown-800"
        />
        <p>
          Para utilizar el sitio web, debés verificar tu dirección de correo
          electrónico.{" "}
          <Link
            className="text-brown-800 underline"
            onClick={(e) => {
              e.preventDefault();
              sendVerificationLink(false);
            }}
          >
            Reenviar enlace de verificación
          </Link>
          .
        </p>
      </div>
    );
  }
}
