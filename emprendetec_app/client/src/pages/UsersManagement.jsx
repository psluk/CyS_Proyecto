import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import UseAxios from "../config/customAxios.js";
import { Avatar, Button, Checkbox } from "@material-tailwind/react";

export default function UsersManagement() {
  const axios = UseAxios();
  const [userDetailsList, setUserDetailsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchUserDetails();
  }, [userDetailsList]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("/api/usuarios/");
      if (response.data && response.data.users) {
        setUserDetailsList(response.data.users);
      }
    } catch (error) {
      console.error("Error al obtener los detalles de los usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const compareValues = (a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  };

  const sortedUserDetailsList = userDetailsList.slice().sort(compareValues);

  const handleUserSelect = (email) => {
    const selectedIndex = selectedUsers.indexOf(email);
    if (selectedIndex === -1) {
      setSelectedUsers([...selectedUsers, email]);
    } else {
      setSelectedUsers(selectedUsers.filter((user) => user !== email));
    }
  };

  const handleDeleteUser = async (emails) => {
    try {
      await Promise.all(
        emails.map(async (email) => {
          await axios.delete(`/api/usuarios/eliminar/${email}`);
        }),
      );
      await fetchUserDetails();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Administración usuarios | EmprendeTEC</title>
        <link rel="canonical" href="/administrar/usuario" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-16 overflow-auto px-4 sm:px-6 lg:px-10">
        <h1 className="text-center font-sans text-xl sm:text-2xl lg:text-3xl xl:text-5xl font-bold text-teal-900">
          Administración de usuarios
        </h1>
        {loading ? (
          <div>Cargando...</div>
        ) : userDetailsList.length > 0 ? (
          <div className="py-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 auto-rows-max items-center justify-items-center">
              <div className="hidden sm:block col-span-1 ">Checkbox</div>
              <div className="col-span-1">Avatar</div>
              <div className="col-span-1 lg:col-span-2 xl:col-span-2">
                <button onClick={() => handleSort("FullName")}>
                  Nombre Completo
                </button>
              </div>
              <div className="hidden lg:block col-span-1">
                <button onClick={() => handleSort("RegistrationDate")}>
                  Fecha de Registro
                </button>
              </div>
              <div className="hidden xl:block col-span-1">
                <button onClick={() => handleSort("Score")}>Puntuación</button>
              </div>
              <Button
                color="red"
                className="col-span-1"
                onClick={() => {
                  handleDeleteUser(selectedUsers);
                }}
              >
                Eliminar seleccionados
              </Button>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {sortedUserDetailsList.map((user, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 auto-rows-max items-center justify-items-center py-4"
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.Email)}
                    onChange={() => handleUserSelect(user.Email)}
                    id="ripple-on"
                    ripple={true}
                    className="order-last md:order-first col-span-1"
                  />
                  <Avatar
                    src="https://docs.material-tailwind.com/img/face-2.jpg"
                    alt="avatar"
                    className="col-span-1"
                  />
                  <div className="col-span-1 lg:col-span-2 xl:col-span-2">{user.FullName}</div>
                  <div className="hidden lg:block col-span-1">
                    {new Date(user.RegistrationDate).toLocaleDateString()}
                  </div>
                  <div className="hidden xl:block col-span-1">{user.Email}</div>
                  <Button
                    color="red"
                    className="hidden sm:block col-span-1"
                    onClick={() => {
                      handleDeleteUser([user.Email]);
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>No se encontraron detalles de usuarios.</div>
        )}
      </main>
    </>
  );
}
