import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import AuthenticatedRoutes from './guard/AuthenticatedRoutes';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import SignIn from './components/SignIn/SignIn';
import NetworkStatusGuard from './guard/NetworkStatusGuard';
import { Toaster } from 'sonner';
import Sidebar from './pages/Sidebar';
import { UserSessionProvider } from './context/UserConext';
import UserPage from './pages/User';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});


function App() {
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <NetworkStatusGuard>
          {/* <SidebarProvider> */}
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                <Route element={<AuthenticatedRoutes />}>
                  <Route element={<UserSessionProvider />}>
                    <Route element={<Sidebar />}>
                      <Route path="/" element={<Home />} />
                      <Route index path="/profile" element={<Profile />} />

                      <Route path="users/" element={<UserPage />}></Route>
                    </Route>
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </Router>
          {/* </SidebarProvider> */}
        </NetworkStatusGuard>
      </QueryClientProvider>
    </>
  );
}

export default App;
