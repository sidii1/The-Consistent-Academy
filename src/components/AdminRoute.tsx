import { useEffect, useState, ReactNode } from "react";
import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setIsAdmin(false);
        return;
      }

      const token = await user.getIdTokenResult(true);

      if (token.claims.admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  if (isAdmin === null) return null;

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
