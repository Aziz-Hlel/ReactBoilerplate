import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return <>User is either null or undefined</>;

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>View your profile information below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className=" flex flex-col space-y-2">
              <div className=" flex items-end space-x-2">
                <Label className=" text-xl">ID : </Label>
                <p>{user.id} </p>
              </div>
              <div className=" flex items-end space-x-2">
                <Label className=" text-xl">Email : </Label>
                <p>{user.email}</p>
              </div>
              <div className=" flex items-end space-x-2">
                <Label className=" text-xl">Username : </Label>
                <p>{user.username}</p>
              </div>
              <div className=" flex items-end space-x-2">
                <Label className=" text-xl">Role : </Label>
                <p>{user.role}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className=" justify-end">
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Profile;
