import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
//import { Link } from 'react-router-dom';

export default function Emprendimientos() {
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("/api/emprendimientos");
      if (response.data && response.data.posts) {
        setPostsList(response.data.posts);
      }
    } catch (error) {
      console.error("Error al obtener los detalles de los usuarios:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Prueba | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos" />
      </Helmet>
      <div className="flex min-h-screen w-full items-start justify-start bg-white p-32">
        {/* EMPRENDIMIENTOS */}
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-8 text-teal-600">Últimos emprendimientos</h1>
          <div className="grid grid-cols-3 gap-4">
            {/* {postsList.map((post, index) => (
              <div className="bg-gray-100 rounded-lg p-4">
                <img src="carteras.jpg" alt="Carteras" className="w-full h-40 object-cover rounded-lg" />
                <div className="flex items-center justify-between mt-2">
                  <h3 className="text-lg font-medium">{post.Title}</h3>
                  <span className="text-gray-500 flex items-center">
                    <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                    {post.Score}
                  </span>
                </div>
              </div>
            )} */}
            <div className="bg-gray-100 rounded-lg p-4">
              <img src="galletas.jpg" alt="Galletas" className="w-full h-40 object-cover rounded-lg" />
              <div className="items-center justify-between mt-2">
                <h3 className="text-lg font-medium">Galletas</h3>
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-600">Fabián Vargas</h2>
                  <span className="text-gray-500 flex items-center">
                    <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                    4.5
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <img src="llaveros.jpg" alt="Llaveros" className="w-full h-40 object-cover rounded-lg" />
              <div className="items-center justify-between mt-2">
                <h3 className="text-lg font-medium">Llaveros</h3>
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-600">Fabián Vargas</h2>
                  <span className="text-gray-500 flex items-center">
                    <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                    4.7
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <img src="carteras.jpg" alt="Carteras" className="w-full h-40 object-cover rounded-lg" />
              <div className="items-center justify-between mt-2">
                <h3 className="text-lg font-medium">Carteras</h3>
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-600">Jasson Segura</h2>
                  <span className="text-gray-500 flex items-center">
                    <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                    4.3
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <img src="estuches.jpg" alt="Estuches" className="w-full h-40 object-cover rounded-lg" />
              <div className="items-center justify-between mt-2">
                <h3 className="text-lg font-medium">Estuches</h3>
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-600">Jasson Segura</h2>
                  <span className="text-gray-500 flex items-center">
                    <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                    4.5
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <img src="cupcakes.jpg" alt="Cupcakes" className="w-full h-40 object-cover rounded-lg" />
              <div className="items-center justify-between mt-2">
                <h3 className="text-lg font-medium">Cupcakes</h3>
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-600">José Pablo Burgos Retana</h2>
                  <span className="text-gray-500 flex">
                    <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                    3.7
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <img src="bordados.jpg" alt="Bordados" className="w-full h-40 object-cover rounded-lg" />
              <div className="items-center justify-between mt-2">
                <h3 className="text-lg font-medium">Bordados</h3>
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-600">Paúl Rodríguez García</h2>
                  <span className="text-gray-500 flex items-center">
                    <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                    4.9
                  </span>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        
        {/* FILTRAR */}
        <div className="p-8 bg-gray-300 rounded ml-10">
          <div className="w-full mb-8">
            <div >
              <h2 className="text-2xl font-bold text-teal-600">Filtrar</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="start-date" className="block text-gray-700 font-medium">Fecha de inicio:</label>
                  <input
                    type="date"
                    id="start-date"
                    className="border rounded-md px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-gray-700 font-medium">Fecha de fin:</label>
                  <input
                    type="date"
                    id="end-date"
                    className="border rounded-md px-3 py-2 w-full"
                  />
                </div>
                <button className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded w-full">
                  Buscar
                </button>
              </div>
              <div className="mt-32">
                <button className="bg-cyan-700 hover:bg-cyan-800 text-white font-medium py-2 px-4 rounded float-right">
                  Crear publicación
                </button>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
      {/* <div className="flex min-h-screen w-full flex-col items-start justify-start bg-white p-32">
        <h1 className="text-3xl font-bold mb-8 text-teal-600">Últimos emprendimientos</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="galletas.jpg" alt="Galletas" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Galletas</h3>
              <span className="text-gray-500 flex items-center">
                <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                4.5
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="llaveros.jpg" alt="Llaveros" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Llaveros</h3>
              <span className="text-gray-500 flex items-center">
                <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                4.7
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="carteras.jpg" alt="Carteras" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Carteras</h3>
              <span className="text-gray-500 flex items-center">
                <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                4.3
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="estuches.jpg" alt="Estuches" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Estuches</h3>
              <span className="text-gray-500 flex items-center">
                <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                4.5
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="cupcakes.jpg" alt="Cupcakes" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Cupcakes</h3>
              <span className="text-gray-500 flex items-center">
                <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                3.7
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="bordados.jpg" alt="Bordados" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Bordados</h3>
              <span className="text-gray-500 flex items-center">
                <img src="../../public/iconos/star.png" className="w-6 h-6 mr-1" />
                4.9
              </span>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="/galletas.jpg" alt="Galletas" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Galletas</h3>
              <span className="text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414l-2.207-2.207V6z" clipRule="evenodd" />
                </svg>
                4.5
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="/llaveros.jpg" alt="Llaveros" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Llaveros</h3>
              <span className="text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414l-2.207-2.207V6z" clipRule="evenodd" />
                </svg>
                4.7
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="/carteras.jpg" alt="Carteras" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Carteras</h3>
              <span className="text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414l-2.207-2.207V6z" clipRule="evenodd" />
                </svg>
                4.3
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="/estuches.jpg" alt="Estuches" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Estuches</h3>
              <span className="text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414l-2.207-2.207V6z" clipRule="evenodd" />
                </svg>
                4.5
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="/cupcakes.jpg" alt="Cupcakes" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Cupcakes</h3>
              <span className="text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414l-2.207-2.207V6z" clipRule="evenodd" />
                </svg>
                3.7
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <img src="/bordados.jpg" alt="Bordados" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-medium">Bordados</h3>
              <span className="text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414l-2.207-2.207V6z" clipRule="evenodd" />
                </svg>
                4.9
              </span>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}