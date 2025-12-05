import { apiService } from '@/Api/apiService';
import BreadcrumbHeader from './Header';
import UsersTable from '@/components/Users/Users';

const UserPage = () => {
  apiService
    .get('/users')
    .then((response) => {
      console.log('Users fetched:', response);
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
  return (
    <div>
      <BreadcrumbHeader
        breadcrumbs={[
          { title: 'User', href: '/users' },
          { title: 'Profile', href: '/users/profile' },
        ]}
      />
      <div className=" flex w-10/12">
        <UsersTable />
      </div>
    </div>
  );
};

export default UserPage;
