import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ToastifyOverride.css";
import { ThemeProvider } from "@material-tailwind/react";

export default function App() {
  const emprendeTecTheme = {};

  return (
    <ThemeProvider value={emprendeTecTheme}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        transition={Flip}
      />
    </ThemeProvider>
  );
}
