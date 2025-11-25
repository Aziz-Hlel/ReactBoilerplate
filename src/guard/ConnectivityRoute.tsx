import testService from "@/Api/service/testService";

const ConnectivityRoute = ({ children }: { children: React.ReactNode }) => {
  testService
    .testConnection()
    .then(() => {
      console.log("API connected:");
    })
    .catch((err) => {
      console.error("API connection failed:", err);
      alert(
        "Cannot connect to the API server. Please check your internet connection or try again later.",
      ); // ! not a good practice for production
    });

  return children;
};

export default ConnectivityRoute;
