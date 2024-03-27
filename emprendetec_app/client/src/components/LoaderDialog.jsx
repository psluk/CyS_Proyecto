import {
  Dialog,
  DialogHeader,
  DialogBody,
  Spinner,
} from "@material-tailwind/react";

export default function LoaderDialog({ open }) {
  return (
    <Dialog open={open} handler={() => {}}>
      <DialogHeader className="text-teal-700">Cargando...</DialogHeader>
      <DialogBody className="flex justify-center py-10">
        <Spinner className="h-12 w-12" color={"teal"} />
      </DialogBody>
    </Dialog>
  );
}
