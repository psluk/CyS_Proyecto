import axios from "axios";
import { useSession } from "../context/SessionContext";

const useAxios = () => {
  const { token } = useSession();

  // Create Axios instance
  const axiosInstance = axios.create();

  // Add a request interceptor in order to inject the token
  axiosInstance.interceptors.request.use(
    config => {
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    }
  );

  return axiosInstance;
}

export default useAxios;