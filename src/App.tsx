import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AuthenticatedRoutes from "./guard/AuthenticatedRoutes";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./components/SignIn/SignIn";
import ConnectivityRoute from "./guard/ConnectivityRoute";


const queryClient = new QueryClient();


function App() {


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ConnectivityRoute >
          <AuthProvider>
            <Router>
              <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                <Route element={<AuthenticatedRoutes />}>

                  <Route path="/protected" element={<Profile />} />



                </Route>



                <Route path="*" element={<NotFound />} />


              </Routes>
            </Router>
          </AuthProvider>
        </ConnectivityRoute>
      </QueryClientProvider>
    </>
  )
}

export default App
