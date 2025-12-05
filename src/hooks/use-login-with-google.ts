import firebaseService from '@/Api/service/firebaseService';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useLoginWithGoogle = () => {
  const { oAuthSignIn } = useAuth();
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    const googleLoginResponse = await firebaseService.loginWithGoogle();

    if (googleLoginResponse.success === false) {
      throw new Error('Failed to sign in with Google: ' + JSON.stringify(googleLoginResponse.error, null, 2));
    }
    const idToken = googleLoginResponse.data;

    const signInResponse = await oAuthSignIn({ idToken });

    if (signInResponse.success === false) {
      throw new Error('OAuth sign-in failed in the backend: ' + JSON.stringify(signInResponse.error, null, 2));
    }

    navigate('/profile');
  };

  return { loginWithGoogle };
};

export default useLoginWithGoogle;
