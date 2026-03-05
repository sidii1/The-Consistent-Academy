import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

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