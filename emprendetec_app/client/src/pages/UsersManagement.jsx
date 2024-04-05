import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Avatar } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Checkbox } from "@material-tailwind/react";

export default function UsersManagement() {
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
      console.log("Obteniendo detalles de usuarios...");
      const response = await axios.get("/api/usuarios/detalles");
      if (response.data && response.data.users) {
        setUserDetailsList(response.data.users);
        console.log("Detalles de usuarios:", userDetailsList);
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
      await Promise.all(emails.map(async (email) => {
        await axios.delete(`/api/usuarios/eliminar/${email}`);
      }));
      // Actualizar la lista de usuarios después de eliminar
      await fetchUserDetails();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

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
              <Button color="red" className="col-span-1" onClick={() => {
                console.log("Usuarios seleccionados:", selectedUsers);                
                handleDeleteUser(selectedUsers);
              }}>
                Eliminar seleccionados
              </Button>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {sortedUserDetailsList.map((user, index) => (
                <div
                  key={index}
                  className="grid auto-rows-max grid-cols-7 items-center py-4 justify-items-center"
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.Email)}
                    onChange={() => handleUserSelect(user.Email)}
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
                  <div className="col-span-1">{user.Email}</div>
                  <Button color="red" className="col-span-1" onClick={() => {
                    console.log("Eliminar usuario:", user.Email);                
                    handleDeleteUser([user.Email]);
                    }}>
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
