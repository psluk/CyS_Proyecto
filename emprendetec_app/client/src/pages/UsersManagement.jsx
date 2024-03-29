import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Avatar } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Checkbox } from "@material-tailwind/react";

export default function UsersManagement() {
  const [userDetailsList, setUserDetailsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState(""); // Campo utilizado para ordenar
  const [sortOrder, setSortOrder] = useState("asc"); // Orden de clasificación: 'asc' para ascendente y 'desc' para descendente

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Hacer la solicitud a la API para obtener los detalles de todos los usuarios
        const response = await axios.get("/api/detallesUsuarios/usuarios");

        // Verificar si la respuesta contiene datos
        if (response.data && response.data.users) {
          // Actualizar el estado con los detalles de los usuarios
          setUserDetailsList(response.data.users);
        }
      } catch (error) {
        console.error("Error al obtener los detalles de los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Función para ordenar los detalles de los usuarios
  const handleSort = (field) => {
    // Si el campo seleccionado ya es el campo de orden actual, cambia el orden
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Si el campo seleccionado es diferente al campo de orden actual, establece el nuevo campo de orden y el orden ascendente
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Función para comparar los valores y ordenar los detalles de los usuarios
  const compareValues = (a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  };

  // Ordenar los detalles de los usuarios en función del campo de orden actual y el orden actual
  const sortedUserDetailsList = userDetailsList.slice().sort(compareValues);

  return (
    <>
      <Helmet>
        <title>Prueba | EmprendeTEC</title>
        <link rel="canonical" href="/GestionUsuarios" />
      </Helmet>
      <div className="container mx-auto px-4">
        {loading ? (
          <div>Cargando...</div>
        ) : userDetailsList.length > 0 ? (
          <div>
            {/* Contenedor para los títulos fijos */}
            <div className="grid auto-rows-max grid-cols-7 items-center py-4 justify-items-center">
              <div className="col-span-1">Checkbox</div>
              <div className="col-span-1">Avatar</div>
              <div className="col-span-2">
                <button onClick={() => handleSort("FullName")}>Nombre Completo</button>
              </div>
              <div className="col-span-1">
                <button onClick={() => handleSort("RegistrationDate")}>Fecha de Registro</button>
              </div>
              <div className="col-span-1">
                <button onClick={() => handleSort("Score")}>Puntuación</button>
              </div>
              <Button color="red" className="col-span-1">
                Eliminar seleccionados
              </Button>
              {/* Agregar más títulos según sea necesario */}
            </div>

            {/* Contenedor para el contenido del grid */}
            <div className="max-h-[500px] overflow-y-auto">
              {sortedUserDetailsList.map((user, index) => (
                <div
                  key={index}
                  className="grid auto-rows-max grid-cols-7 items-center py-4 justify-items-center"
                >
                  <Checkbox
                    defaultChecked
                    id="ripple-on"
                    ripple={true}
                    className="col-span-1"
                  />
                  <Avatar
                    src="https://docs.material-tailwind.com/img/face-2.jpg"
                    alt="avatar"
                    className="col-span-1"
                  />
                  <div className="col-span-2">{user.FullName}</div>
                  <div className="col-span-1">
                    {new Date(user.RegistrationDate).toLocaleDateString()}
                  </div>
                  <div className="col-span-1">{user.Score}</div>
                  <Button color="red" className="col-span-1">
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>No se encontraron detalles de usuarios.</div>
        )}
      </div>
    </>
  );
}
