import { apiService } from "@/Api/apiService";
import BreadcrumbHeader from "./Header";

const UserPage = () => {
  apiService
    .get("/users")
    .then((response) => {
      console.log("Users fetched:", response);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
  return (
    <div>
      <BreadcrumbHeader
        breadcrumbs={[
          { title: "User", href: "/users" },
          { title: "Profile", href: "/users/profile" },
        ]}
      />
      <div className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4"></div>
        User Page
      </div>
    </div>
  );
};

export default UserPage;
