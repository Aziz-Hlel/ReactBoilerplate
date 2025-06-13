import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";


const queryClient = new QueryClient();


function App() {


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              


            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
