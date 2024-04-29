import { Button } from "@material-tailwind/react";
import { useSession } from "../context/SessionContext";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Navbar() {
  const currentPath = useLocation().pathname;
  const { getUserType, logout } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation links
  // The userTypes property is used to determine which user types can access the link
  // If the userTypes property is not present, the link is accessible to all users
  const navigationLinks = [
    {
      label: "Inicio",
      path: "/",
    },
    {
      label: "Emprendimientos",
      path: "/emprendimientos",
    },
    {
      label: "Panel de administración",
      path: "/administrar",
      userTypes: ["Administrator"],
    },
    {
      label: "Mi Perfil",
      path: "/perfil",
      userTypes: ["Administrator", "Professor", "Student"],
    },
    {
      component: (
        <Button variant="gradient" color="blue">
          Iniciar sesión
        </Button>
      ),
      path: "/iniciar-sesion",
      userTypes: [undefined],
    },
    {
      component: (
        <Button
          variant="filled"
          color="blue-gray"
          onClick={(e) => {
            e.preventDefault();
            logout();
            setIsMenuOpen(false);
          }}
        >
          Cerrar sesión
        </Button>
      ),
      userTypes: ["Administrator", "Professor", "Student"],
    },
  ];

  return (
    <nav className="fixed top-0 flex h-20 w-full justify-center bg-gray-100 px-10 py-4 md:py-3 z-[1001]">
      <div className="flex w-full max-w-7xl flex-row items-center justify-between">
        <Link
          to="/"
          className="h-full grow text-lg font-bold uppercase text-teal-600 drop-shadow-sm transition-all hover:drop-shadow-md md:text-xl"
        >
          <img
            src="/logos/greenLogo.svg"
            className="inline-block h-full pe-2"
          />{" "}
          <span className="max-xs:hidden">EmprendeTEC</span>
        </Link>
        <div
          className={`max-lg:absolute ${isMenuOpen ? "max-lg:left-0" : "max-lg:left-full"} transition-[left] max-lg:top-20 max-lg:w-screen max-lg:bg-gray-200/80 max-lg:py-5 max-lg:backdrop-blur-md duration-500 max-h-[calc(100dv-5rem)] max-lg:overflow-y-auto max-lg:shadow-lg max-lg:rounded-lg`}
        >
          <ul className="flex flew-row max-lg:flex-col items-center gap-7">
            {navigationLinks
              .filter(
                (link) =>
                  !link.userTypes ||
                  !link.userTypes.length ||
                  link.userTypes.includes(getUserType()),
              )
              .map((link, index) => {
                return (
                  <li key={index} className="max-lg:flex max-lg:w-full items-center max-lg:px-10">
                    <Link
                      to={link.path}
                      className={`${link.path === currentPath ? "font-semibold text-gray-900" : "font-medium text-gray-700 hover:text-gray-900"} transition grow text-center`}
                      onClick={() => {setIsMenuOpen(false)}}
                    >
                      {link.component || link.label}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        {
          // Mobile menu
          isMenuOpen ? (
            <FontAwesomeIcon
              icon={faXmark}
              className="h-9 w-9 text-gray-800 lg:hidden"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faBars}
              className="h-8 w-8 text-gray-800 lg:hidden"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            />
          )
        }
      </div>
    </nav>
  );
}
