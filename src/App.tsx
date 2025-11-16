import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AuthenticatedRoutes from "./guard/AuthenticatedRoutes";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./components/SignIn/SignIn";


const queryClient = new QueryClient();


function App() {


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              <Route element={<AuthenticatedRoutes />}>

                <Route path="/protected" element={<Profile />} />



              </Route>



              <Route path="*" element={<NotFound />} />


            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
