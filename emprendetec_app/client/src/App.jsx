import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdministratorPanel from "./pages/AdministratorPanel";
import UsersManagement from "./pages/UsersManagement";
import Navbar from "./components/Navbar";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ToastifyOverride.css";
import { ThemeProvider } from "@material-tailwind/react";
import { useSession } from "./context/SessionContext";
import LoaderDialog from "./components/LoaderDialog";
import VerifyEmail from "./components/VerifyEmail";

export default function App() {
  const emprendeTecTheme = {};
  const { loading } = useSession();

  return (
    <ThemeProvider value={emprendeTecTheme}>
      <Navbar />
      <VerifyEmail />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/registrarse" element={<SignUp />} />
        <Route path="/administrar" element={<AdministratorPanel />} />
        <Route path="/GestionUsuarios" element={<UsersManagement />} />
      </Routes>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        transition={Flip}
      />
      <LoaderDialog open={loading} />
    </ThemeProvider>
  );
}
