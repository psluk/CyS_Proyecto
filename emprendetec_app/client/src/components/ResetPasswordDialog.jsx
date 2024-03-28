import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { defaultError } from "../utils/ErrorSettings";

export default function ResetPasswordDialog({ defaultEmail, open, handler }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const auth = getAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Se ha enviado un enlace de recuperación a su correo.");
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        toast.error(defaultError);
      });

    //formRef.current?.reset();
    setSubmitting(false);
    handler();
  };

  useEffect(() => {
    if (open) {
      setEmail(defaultEmail);
    }
  }, [open, defaultEmail]);

  return (
    <Dialog open={open} handler={handler}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>Recuperar contraseña</DialogHeader>
        <DialogBody>
          <p>
            Digitá tu correo a continuación. Si existe una cuenta con dicho
            correo, te enviaremos un enlace para recuperar el acceso a tu
            cuenta.
          </p>
          <div className="pt-5">
            <Input
              type="email"
              label="Correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button color="teal" type="submit" loading={submitting}>
            Solicitar enlace de recuperación
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
