import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Rating } from "@material-tailwind/react";

export default function DetallesPost() {
    const [post, setPost] = useState([]);
    const params = useParams()
    //const [x, setX] = useState([]);

    useEffect(() => {
        fetchPost();
    }, []);
    
    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/emprendimientos/${params.id}`);
            
            if (response.data && response.data.post && response.data.post.length > 0) {
                console.log("Se obtuvo el emprendimeinto")
                console.log(response.data.post[0].Title)
                setPost(response.data.post[0]);
                //setX(1);
            }
        } catch (error) {
            console.error("Error al obtener el emprendimiento:", error);
        }
    };

    return (
      <>
        <Helmet>
          <title>Prueba | EmprendeTEC</title>
          <link rel="canonical" href="/emprendimientos/:id" />
        </Helmet>
        <div className="flex min-h-screen w-full items-start justify-start bg-white p-32">
          <div>
            <img src={post.ImagePost} alt="emprendimiento.jpg" className="w-96"/>
          </div>
          {/* EMPRENDIMIENTOS */}
          <div className="w-full ml-16 mr-24">
            <h1 className="text-3xl font-bold mb-8">{post && post.Title}</h1>
            <Rating value={post && post.Score} />
            <p className="mt-8">{post && post.DescriptionPost}</p>
            {/* <div className="">
                d
            </div> */}
          </div>
          
        </div>
      </>
    );
  }