import { Helmet } from "react-helmet-async";
//import { Link } from 'react-router-dom';
export default function Perfil() {
  return (
    <>
      <Helmet>
        <title>Prueba | EmprendeTEC</title>
        <link rel="canonical" href="/perfil" />
      </Helmet>
      <div className="flex min-h-screen w-full flex-col items-start justify-start bg-white p-32">
        <div className="w-full gap-4 left flex">
        
          <div className="flex w-1/2">
            <img src="/iconos/perfil.png" className="size-28 rounded-2xl" />
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-teal-600">Juan Pérez Rodríguez</h2>
              <p className="text-gray-500">Ingeniería en Computación</p>
              <div className="flex items-center text-gray-500 mt-8">
                <img src="/iconos/star.png" className="size-6"></img>
                <span className="ml-1">4.5</span>
              </div>
            </div>
          </div>
          <div className="w-1/2 text-right space-y-2">
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded">
              Contactar
            </button><br/>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded">
              Modificar
            </button>
          </div>
          
        </div>
        <div className="bg-red-100 w-full grid grid-cols-4">
          
          <p>hola</p>
          <p>Mundo</p>
          <p>Ingrato</p>
          <p>XD</p>
          <p>Nono</p>
        </div>
      </div>
    </>
  );
}