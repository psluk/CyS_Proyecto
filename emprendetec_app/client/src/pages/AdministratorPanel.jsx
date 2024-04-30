import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
export default function AdministratorPanel() {
  return (
    <>
      <Helmet>
        <title>Panel de adminstración | EmprendeTEC</title>
        <link rel="canonical" href="/administar" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-16 px-10">
        <h1 className="text-center font-sans text-2xl font-bold text-teal-900 sm:text-3xl lg:text-5xl">
          Menú de administración
        </h1>
        <div className="grid grid-cols-1 gap-4">
          <Link
            to="/administrar/usuarios"
            className="w-full text-xl font-bold text-white"
          >
            <Button color="teal" size="lg" className="w-full">
              Administrar usuarios
            </Button>
          </Link>
          <Link
            to="/emprendimientos/crear"
            className="w-full text-xl font-bold text-white"
          >
            <Button color="teal" size="lg" className="w-full">
              Administrar emprendimientos
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}
