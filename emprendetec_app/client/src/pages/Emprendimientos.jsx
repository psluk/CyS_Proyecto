import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function Emprendimientos() {
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    console.log("Entra");
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/emprendimientos");
      if (response.data && response.data.posts) {
        console.log("Se obtuvieron los emprendimientos")
        setPostsList(response.data.posts);
      }
    } catch (error) {
      console.error("Error al obtener los emprendimientos:", error);
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
            {postsList.map(post => (
              
              <div key={post.ID} className="bg-gray-100 rounded-lg p-4">
                {console.log(post.Title)}
                <Link to={`/emprendimientos/${post.ID}`}>
                <img src={post.ImagePost} alt="Carteras" className="w-full h-40 object-cover rounded-lg" />
                <div className="items-center justify-between mt-2">
                  <h3 className="text-lg font-medium">{post.Title}</h3>
                  <div className="flex items-center justify-between">
                    <h2 className="text-gray-600">{post.FullName}</h2>
                    <span className="text-gray-500 flex items-center">
                      <img src="/iconos/star.png" className="w-6 h-6 mr-1" />
                      {post.Score}
                    </span>
                  </div>
                </div>
                </Link>
              </div>
              
            ))}
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
    </>
  );
}