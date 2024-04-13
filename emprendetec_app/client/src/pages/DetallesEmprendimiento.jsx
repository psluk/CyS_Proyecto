import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Rating } from "@material-tailwind/react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function DetallesPost() {
    const [post, setPost] = useState([]);
    const params = useParams()
    
    const images = [
      {
        original: "https://picsum.photos/id/1018/1000/600",
        thumbnail: "https://picsum.photos/id/1018/100/60",
      },
      {
        original: "https://picsum.photos/id/1015/1000/600",
        thumbnail: "https://picsum.photos/id/1015/100/60",
      },
      {
        original: "https://picsum.photos/id/1016/1000/600",
        thumbnail: "https://picsum.photos/id/1016/100/60",
      },
      {
        original: "https://picsum.photos/id/1013/1000/600",
        thumbnail: "https://picsum.photos/id/1013/100/60",
      },
      {
        original: "https://picsum.photos/id/1019/1000/600",
        thumbnail: "https://picsum.photos/id/1019/100/60",
      }
    ]

    useEffect(() => {
        fetchPost();
    }, []);
    
    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/emprendimientos/${params.id}`);
            
            if (response.data && response.data.post && response.data.post.length > 0) {
                setPost(response.data.post[0]);
            }
        } catch (error) {
            console.error("Error al obtener el emprendimiento:", error);
        }
    };

    const score = Math.round(post.Score)

    return (
      <>
        <Helmet>
          <title>Prueba | EmprendeTEC</title>
          <link rel="canonical" href="/emprendimientos/:id" />
        </Helmet>
        <div className="flex min-h-screen w-full items-start justify-start bg-white p-32">
          <div>
            <ImageGallery items={images} />
          </div>
          
          {/* <div id="gallery" className="relative w-full" data-carouse="slide">
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                <div className="duration-700 ease-in-out" data-carousel-item>
                    <img src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg" className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt=""/>
                </div>
                <div className="duration-700 ease-in-out" data-carousel-item="active">
                    <img src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg" className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt=""/>
                </div>
                <div className="duration-700 ease-in-out" data-carousel-item>
                    <img src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg" className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt=""/>
                </div>
                <div className="duration-700 ease-in-out" data-carousel-item>
                    <img src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg" className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt=""/>
                </div>
                <div className="duration-700 ease-in-out" data-carousel-item>
                    <img src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg" className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt=""/>
                </div>
            </div>
            <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <polyline points="15 18 9 12 15 6" /></svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <polyline points="9 18 15 12 9 6" /></svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>
        </div> */}
          {/* <div className="grid gap-4">
            <div>
              <img className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
                src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1470&amp;q=80"
                alt="" />
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1470&amp;q=80"
                  className="object-cover object-center h-20 max-w-full rounded-lg cursor-pointer" alt="gallery-image" />
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80"
                  className="object-cover object-center h-20 max-w-full rounded-lg cursor-pointer" alt="gallery-image" />
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2940&amp;q=80"
                  className="object-cover object-center h-20 max-w-full rounded-lg cursor-pointer" alt="gallery-image" />
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2762&amp;q=80"
                  className="object-cover object-center h-20 max-w-full rounded-lg cursor-pointer" alt="gallery-image" />
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2832&amp;q=80"
                  className="object-cover object-center h-20 max-w-full rounded-lg cursor-pointer" alt="gallery-image" />
              </div>
            </div>
          </div> */}
          {/* <div>

            <img src={post.ImagePost} alt="emprendimiento.jpg" className="w-svw"/>
          </div> */}
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