import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import UseAxios from "../config/customAxios.js";
import { Link } from 'react-router-dom';
import { Input, Button } from "@material-tailwind/react";

export default function Emprendimientos() {
  const axios = UseAxios();
  const [postsList, setPostsList] = useState([]);
  const [filterText, setFilterText] = useState('');

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

  const fetchFilterPosts = async () => {
    try {
      console.log('FILTER POST TEXT: ' + filterText)
      const response = await axios.get(`/api/emprendimientos/${filterText}`);
      if (response.data && response.data.posts) {
        setPostsList(response.data.posts);
      }
      
    } catch (error) {
      console.error("Error al obtener los emprendimientos:", error);
    }
  };

  const getImage = (post) => {
    if (post.ImagePost)
      return (
        <img src={post.ImagePost} alt={post.Title} className="w-full aspect-square object-cover rounded-lg" />
    )
    else
      return(
        <img className="rounded-2xl mb-2" src='/default/no-image.jpeg'/>
    )
  }

  return (
    <>
      <Helmet>
        <title>Emprendimientos | EmprendeTEC</title>
        <link rel="canonical" href="/emprendimientos" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-16 px-10">
        <div className="flex flex-col-reverse md:flex-row min-h-screen w-full items-start justify-start bg-white">
          {/* EMPRENDIMIENTOS */}
          <div className="w-full">
            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
              <h1 className="text-3xl font-bold mb-8 text-teal-600">Listado de emprendimientos</h1>
              <Link to="/emprendimientos/mapa">
                <Button color="blue">
                  Ver mapa
                </Button>
              </Link>
            </div>
            <div className="flex flex-col-reverse md:flex-row min-h-screen w-full items-start justify-start bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {postsList.map(post => (
                  <div key={post.ID} className="bg-gray-100 rounded-lg p-4">
                    <Link to={`/emprendimientos/${post.ID}`}>
                    {getImage(post)}
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

              {/* FILTRAR */}
              <div className="p-8 w-full mb-5 md:ml-10 bg-gray-300 rounded">
                <div className="w-full mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-teal-600">Filtrar</h2>
                    <div className="space-y-4">
                      <div>
                      <Input
                          value={filterText}
                          label="Buscar"
                          placeholder="Ingrese el texto para buscar coincidencias"
                          color="teal"
                          onChange={(e) => setFilterText(e.target.value)}
                          >
                        </Input>
                      </div>
                      <Button
                        className="bg-teal-500 hover:bg-teal-700 text-white font-bold px-4 w-full text-center"
                        onClick={fetchFilterPosts}
                      >
                        Buscar
                      </Button>
                    </div>
                    <div className="mt-3 md:mt-32">
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
          </div>
          
          
        </div>
      </main>
    </>
  );
}