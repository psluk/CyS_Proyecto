import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from "axios";


export default function Perfil() {
  const [postsList, setPostsList] = useState([]);
  const [user, setUser] = useState([]);
  const [userImage, setUserImage] = useState('/default/perfil.png');
  const params = useParams()

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/emprendimientos/usuario/${params.id}`);
      if (response.data && response.data.posts) {
        setPostsList(response.data.posts);
      }
    } catch (error) {
      console.error("Error al obtener los emprendimientos:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/usuarios/${params.id}`);
      if (response.data && response.data.user) {
        setUser(response.data.user[0]);
        if (response.data.user[0].ImageUser != null){
          setUserImage(response.data.user[0].ImageUser);
        }
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
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
        <title>Usuario | EmprendeTEC</title>
        <link rel="canonical" href="/perfil" />
      </Helmet>
      <main className="w-full max-w-7xl space-y-16 px-10">
        <div className="flex min-h-screen w-full flex-col items-start justify-start bg-white">
          <div className="w-full gap-4 left flex">
            <div className="flex w-1/2">
              <img src={userImage} alt="/iconos/perfil.png" className="size-28 rounded-2xl" />
              <div className="ml-4">
                <h2 className="text-2xl font-bxold text-teal-600">{user.FullName}</h2>
                <div className="flex items-center text-gray-500 mt-8">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" color="#F4D93F" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 fill-yellow-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  <span className="ml-1">{user.Score}</span>
                </div>
              </div>
            </div>
            <div className="w-1/2 text-right space-y-2">
              <button disabled className="bg-gray-500 text-white font-medium py-2 px-4 rounded">
                Contactar
              </button>
            </div>
            
          </div>
          <div className="mt-16">
            <h1 className="text-3xl font-bold mb-8 text-teal-600">Últimos emprendimientos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
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
          </div>
        </div>
      </main>
    </>
  );
}