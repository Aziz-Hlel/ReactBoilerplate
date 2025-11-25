import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <>User is either null or undefined</>;

  return (
    <>
      <div>Email : </div>
      <div>{user.email}</div>
    </>
  );
};

export default Profile;
