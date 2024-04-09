import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
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
        <div className="left grid grid-cols-1 gap-4">
          <div className="rounded-md bg-teal-600 p-4 ">
            <Link
              to="/GestionUsuarios"
              className="ml-8 text-xl font-bold text-white"
            >
              Administrar Usuarios
            </Link>
          </div>
          <div className="rounded-md bg-teal-600 p-4">
            <Link to="/" className="ml-8 text-xl font-bold text-white">
              Administrar Emprendimientos
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
