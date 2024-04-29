import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useSession } from "../context/SessionContext";
import { Link } from 'react-router-dom';
import axios from "axios";


export default function Perfil() {
  const { getUserID, loading } = useSession();
  const [postsList, setPostsList] = useState([]);
  const [user, setUser] = useState([]);
  const [userId, setUserID] = useState(getUserID());
  const [userImage, setUserImage] = useState('/default/perfil.png');

  useEffect(() => {
    if (userId){
      fetchUser();
      fetchPosts();
    }
  }, [userId]);

  useEffect(() => {
    if (!loading){
      setUserID(getUserID());
    }
  }, [loading]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/usuarios/${userId}`);
      if (response.data && response.data.user) {
        setUser(response.data.user[0]);
        setUserID(response.data.user[0].ID)
        if (response.data.user[0].ImageUser != null){
          setUserImage(response.data.user[0].ImageUser);
        }
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/emprendimientos/usuario/${userId}`);
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
        <img src={post.ImagePost} alt={post.Title} className="w-full h-40 object-cover rounded-lg" />
    )
    else
      return(
        <img className="rounded-2xl mb-2" src='/default/no-image.jpeg'/>
    )
  }

  return (
    <>
      <Helmet>
        <title>Prueba | EmprendeTEC</title>
        <link rel="canonical" href="/perfil" />
      </Helmet>
      <div className="flex min-h-screen w-full flex-col items-start justify-start bg-white p-32">
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
            <Link to={'/perfil/editar'}>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded">
                Modificar
              </button>
            </Link>
          </div>
          
        </div>
        <div className="mt-16">
          <h1 className="text-3xl font-bold mb-8 text-teal-600">Últimos emprendimientos</h1>
          <div className="w-full grid grid-cols-4 gap-4">
            {postsList.map(post => (
              <div key={post.ID} className="bg-gray-100 rounded-lg p-4">
                {console.log(post.Title)}
                <Link to={`/emprendimientos/ModifyEntrepreneurship/${post.ID}`}>
                {getImage(post)}
                <div className="items-center justify-between mt-2">
                  <span className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{post.Title}</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </span>
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
    </>
  );
}