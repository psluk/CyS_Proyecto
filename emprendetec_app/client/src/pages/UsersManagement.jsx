import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  validatePassword,
  passwordRequirements,
} from "../../../common/utils/validations";
import {
  faPencil,
  faMagnifyingGlass,
  faSort,
  faTrash,
  faEye,
  faEyeSlash,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Rating,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import UseAxios from "../config/customAxios.js";

export default function UsersManagement() {
  const axios = UseAxios();
  const [togglePassword, setTogglePassword] = useState(false);
  const [userDetailsList, setUserDetailsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(true);
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const totalPages = Math.ceil(userDetailsList.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = currentPage * usersPerPage;

  const handleOpen = () => setOpen(!open);
  const handleOpenEdit = () => setOpenEdit(!openEdit);
  const TABS = [
    { label: "All", value: "all" },
    { label: "Monitored", value: "monitored" },
    { label: "Unmonitored", value: "unmonitored" },
  ];

  const TABLE_HEAD = [
    { label: "Usuario", field: "FullName" },
    { label: "Fecha de registro", field: "RegistrationDate" },
    { label: "Puntuación", field: "Score" },
    { label: "Editar", field: "" },
    { label: "Eliminar", field: "" },
  ];

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("/api/usuarios/");
      if (response.data && response.data.users) {
        setUserDetailsList(response.data.users);
        console.log("Detalles de usuarios:", response.data.users);
      }
    } catch (error) {
      console.error("Error al obtener los detalles de los usuarios:", error);
    } finally {
      setLoading(false);
    }
  };
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(value);

    if (name === "password") {
      setIsPasswordInvalid(!validatePassword(value).isValid);
    }
  };

  const handleSort = (field) => {
    const compareValues = (a, b) => {
      if (a[field] < b[field]) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    };

    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }

    const sortedUserDetailsList = userDetailsList.slice().sort(compareValues);
    setUserDetailsList(sortedUserDetailsList);
  };

  const [filteredUserDetailsList, setFilteredUserDetailsList] = useState([]);

  useEffect(() => {
    // Filtrar la lista de detalles de usuario en función del valor de búsqueda
    const filteredList = userDetailsList.filter((user) =>
      user.FullName.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilteredUserDetailsList(filteredList);
  }, [userDetailsList, searchValue]);

  const userListToDisplay = searchValue
    ? filteredUserDetailsList
    : userDetailsList;
  const usersToShow = userListToDisplay.slice(startIndex, endIndex);

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

  
  const updateUser = async (user) => {
    try {
      if (givenName === "" || familyName === "") {
        toast.error("El nombre y apellido no pueden quedar vacíos");
        return -1;
      }
      if (isPasswordInvalid && password != "") {
        toast.error(
          "Corrige los errores en la contraseña y volvé a intentarlo",
        );
        return -1;
      }
      const uploadedImageUrl = user.img ? user.img : "";

      const response = axios.put("/api/usuarios/editar-perfil", {
        email: user.Email,
        givenName: givenName,
        familyName: familyName,
        password: password,
        image: uploadedImageUrl,
      });
      return 1;
    } catch (error) {
      console.error("Error con los datos:", error);
      return -1;
    }
  };

  const handleUpdate = async (selectedUser) => {
    try {
      const res = await updateUser(selectedUser);
      if (res !== -1) {
        toast.success("Actualización realizada con éxito.");
        await fetchUserDetails();
        //toast.info("Si no ve los cambios actualice la página");
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      toast.error("Hubo un error al actualizar el usuario.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Administración usuarios | EmprendeTEC</title>
        <link rel="canonical" href="/administrar/usuario" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-16 overflow-auto px-4 sm:px-6 lg:px-10">
        <h1 className="text-center font-sans text-xl font-bold text-teal-900 sm:text-2xl lg:text-3xl xl:text-5xl">
          Administración de usuarios
        </h1>
        {loading ? (
          <div>Cargando...</div>
        ) : userDetailsList.length > 0 ? (
          <Card className="h-full w-full">
            <CardHeader className="flex items-center justify-between p-4">
              <div className="ml-auto w-full md:w-72">
                <Input
                  label="Buscar"
                  icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
              <table className="mt-4 w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map(({ label, field }, index) => (
                      <th
                        key={label}
                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                        onClick={() => handleSort(field)}
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                          {label}
                          {index !== TABLE_HEAD.length - 2 &&
                            index !== TABLE_HEAD.length - 1 && (
                              <FontAwesomeIcon
                                icon={faSort}
                                className="h-4 w-4"
                              />
                            )}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {usersToShow.map((user, index) => {
                    const isLast = index === usersToShow.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={user.FullName}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={
                                user.img ? user.img : "../logos/greenLogo.svg"
                              }
                              alt={user.FullName}
                              size="sm"
                            />
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {user.FullName}
                              </Typography>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70"
                              >
                                {user.Email}
                              </Typography>
                            </div>
                          </div>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {new Date(
                              user.RegistrationDate,
                            ).toLocaleDateString()}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {<Rating value={user.Score} readonly />}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Editar Usuario">
                            <IconButton
                              variant="text"
                              onClick={() => {
                                setSelectedUser(user);
                                handleOpenEdit();
                              }}
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Eliminar Usuario">
                            <IconButton
                              color="red"
                              size="md"
                              variant="text"
                              onClick={() => {
                                setSelectedUser(user);
                                handleOpen();
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                Página {currentPage} de {totalPages}
              </Typography>
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={handlePreviousPage}
                >
                  Anterior
                </Button>
                <Button variant="outlined" size="sm" onClick={handleNextPage}>
                  Siguiente
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <div>No se encontraron detalles de usuarios.</div>
        )}
        <Dialog open={open && selectedUser !== ""} handler={handleOpen}>
          <DialogHeader>Confirmar Borrado de Usuario</DialogHeader>
          <DialogBody>
            ¿Estás seguro de que deseas borrar este usuario? Esta acción no se
            puede deshacer.
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              onClick={() => {
                setSelectedUser(null);
                handleOpen();
              }}
              className="mr-1"
            >
              <span>Cancelar</span>
            </Button>
            <Button
              variant="gradient"
              color="red"
              onClick={() => {
                handleDeleteUser([selectedUser.Email]);
                setSelectedUser(null);
                handleOpen();
              }}
            >
              <span>Confirmar</span>
            </Button>
          </DialogFooter>
        </Dialog>

        <Dialog
          size="xs"
          open={openEdit && selectedUser !== null}
          handler={handleOpenEdit}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Actualizar información del usuario
              </Typography>
              <Typography className="-mb-2" variant="h6">
                Nombre
              </Typography>
              <Input
                label="Nombre"
                size="lg"
                type="text"
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
              />
              <Typography className="-mb-2" variant="h6">
                Apellidos
              </Typography>
              <Input
                label="Apellidos"
                size="lg"
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
              />
              <Typography className="-mb-2" variant="h6">
                Contraseña
              </Typography>
              <Input
                name="password"
                label="Contraseña"
                size="lg"
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e)}
              />
              <ul className="w-full py-2 lg:px-10">
                {passwordRequirements.map((requirement, index) => {
                  const isMet = requirement.validate(password);
                  return (
                    <li key={index} className="text-sm">
                      <FontAwesomeIcon
                        icon={isMet ? faCheck : faXmark}
                        className={`${isMet ? "text-green-700" : "text-red-500"} inline-block w-3 pe-2`}
                      ></FontAwesomeIcon>
                      {requirement.label}
                    </li>
                  );
                })}
              </ul>
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                variant="gradient"
                onClick={() => {
                  handleUpdate(selectedUser);
                  setSelectedUser(null);
                  handleOpenEdit();
                }}
                fullWidth
              >
                Update
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
      </main>
    </>
  );
}
