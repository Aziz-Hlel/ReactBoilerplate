import apiRoutes from "@/Api/routes/routes";
import ENV from "@/config/env.variables";
import axios from "axios";

const ConnectivityRoute = ({ children }: { children: React.ReactNode }) => {

  
  axios
    .get(ENV.BASE_URL + apiRoutes.health())
    .then(() => {
      console.log("API connected:");
    })
    .catch((err) => {
      console.error("API connection failed:", err);
      alert(
        "Cannot connect to the API server. Please check your internet connection or try again later."
      ); // ! not a good practice for production
    });

    
  return children;
};

export default ConnectivityRoute;
