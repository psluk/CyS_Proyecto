import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "@material-tailwind/react";

export default function Signup() {
  const [data, setData] = useState({});

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
            />
            <Input
              type="text"
              label="Apellidos"
              color="teal"
              size="lg"
              required={true}
              onChange={(e) => setData({ ...data, lastname: e.target.value })}
              className="!border-2"
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
          />
          <Input
            type="password"
            label="Contraseña"
            color="teal"
            size="lg"
            required={true}
            className="!border-2"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
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
