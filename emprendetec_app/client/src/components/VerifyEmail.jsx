import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "../context/SessionContext";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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
      <div className="mt-20 flex w-full items-center justify-center bg-yellow-300 py-2 text-center shadow-inner px-10">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="inline-block pe-2 text-brown-800"
        />
        <p>
          Para utilizar el sitio web, debés verificar tu dirección de correo
          electrónico. <Link className="text-brown-800 underline">Reenviar enlace de verificación</Link>.
        </p>
      </div>
    );
  }
}
