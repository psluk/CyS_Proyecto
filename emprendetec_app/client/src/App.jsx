import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdministratorPanel from "./pages/AdministratorPanel";
import UsersManagement from "./pages/UsersManagement";
import CreateEntrepreneurship from "./pages/CreateEntrepreneurship";
import MyProfile from "./pages/MyProfile";
import ProfileUser from "./pages/ProfileUser";
import Posts from "./pages/Posts";
import PostDetails from "./pages/PostDetails";
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
        <Route path="/administrar/usuarios" element={<UsersManagement />} />
        <Route path="/emprendimientos/crear" element={<CreateEntrepreneurship />} />
        <Route path="/perfil" element={<MyProfile />} /> 
        <Route path="/usuario/:id" element={<ProfileUser />} /> 
        <Route path="/emprendimientos" element={<Posts />} />
        <Route path="/emprendimientos/:id" element={<PostDetails />} />
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
