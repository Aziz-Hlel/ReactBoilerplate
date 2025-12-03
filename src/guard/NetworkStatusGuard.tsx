import apiRoutes from '@/Api/routes/routes';
import ENV from '@/config/env.variables';
import toastWrapper from '@/utils/toastWrapper';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'sonner';

const NetworkStatusGuard = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // const handleOnline = () => setIsOnline(true);
    const handleOffline = () =>
      toast.error('You are currently offline. Please check your internet connection.', {
        // icon: "⚠️",
        classNames: {
          toast: 'cursor-default',
          icon: 'text-red-600',
        },
      });

    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  axios
    .get(ENV.BASE_URL + apiRoutes.health())
    .then(() => {
      console.log('API connected:');
    })
    .catch((err) => {
      console.error('API connection failed:', err);
      toastWrapper.dev.Critical('API connection failed to connect to the server. ', {
        description: typeof err === 'string' ? err : JSON.stringify(err.message),
      });
    });

  return children;
};

export default NetworkStatusGuard;
