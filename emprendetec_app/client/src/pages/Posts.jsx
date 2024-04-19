import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function Emprendimientos() {
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/emprendimientos");
      if (response.data && response.data.posts) {
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
                <img src={post.ImagePost} alt={post.Title} className="w-full h-40 object-cover rounded-lg" />
                <div className="items-center justify-between mt-2">
                  <h3 className="text-lg font-medium">{post.Title}</h3>
                  <div className="flex items-center justify-between">
                    <h2 className="text-gray-600">{post.FullName}</h2>
                    <span className="text-gray-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" color="#F4D93F" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 fill-yellow-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
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
                <Link to={"/emprendimientos/crear"}>
                  <button className="bg-cyan-700 hover:bg-cyan-800 text-white font-medium py-2 px-4 rounded float-right">
                    Crear publicación
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}