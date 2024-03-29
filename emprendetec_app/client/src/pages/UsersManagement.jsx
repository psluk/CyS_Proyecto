import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import {
    List,
    ListItem,
    ListItemSuffix,
    Chip,
    Card,
  } from "@material-tailwind/react";
   
export default function AdministratorPanel() {
  return (
    <>
      <Helmet>
        <title>Prueba | EmprendeTEC</title>
        <link rel="canonical" href="/GestionUsuarios" />
      </Helmet>
      <div className="flex min-h-screen w-2/3 flex-col items-start justify-start bg-gray-100 p-8">
        <h1 className="mb-8 text-4xl font-bold text-teal-700">Administrar</h1>
        <div className="grid grid-cols-1 gap-4 left">
        <div className="rounded-md bg-white p-4 ">
            <Link
              to="/"
              className="text-xl font-bold text-black ml-8"
            >
              Administrar Usuarios
            </Link>
          </div>
          <div className="rounded-md bg-white p-4">
            <Link
              to="/"
              className="text-xl font-bold text-black ml-8"
            >
              Administrar Emprendimientos
            </Link>
          </div>
          <div className="rounded-md bg-white p-4">
            <Link
              to="/"
              className="text-xl font-bold text-black ml-8"
            >
              Administrar Emprendimientos
            </Link>
          </div>

    <Card className="w-96">
      <List>
        <ListItem>
          Inbox
          <ListItemSuffix>
            <Chip
              value="14"
              variant="ghost"
              size="sm"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem>
        <ListItem className="flex-row">
          Spam
          <ListItemSuffix>
            <Chip
              value="2"
              variant="ghost"
              size="sm"
              className="rounded-full"
            />
            <Chip
              value="2"
              variant="ghost"
              size="sm"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem>
        <ListItem>
          Trash
          <ListItemSuffix>
            <Chip
              value="40"
              variant="ghost"
              size="sm"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem>
      </List>
    </Card>

        </div>
      </div>
    </>
  );
}
