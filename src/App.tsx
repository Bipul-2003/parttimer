import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingAnimation from "./components/LoadingAnimation";
import { useAuth } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  const { checkUser, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileComplete = async () => {
      if (!user) {
        console.error('User is not defined');
        return;
      }

      if ('user_type' in user && user.user_type === "LABOUR") {
        return;
      }

      if ('user_type' in user && user.user_type === "USER" && 'email' in user) {
        try {
          const profileStatus = await checkUser(user.email);

          if (!profileStatus.profileComplete) {
            const nameParts = user.name.trim().split(/\s+/);
            const firstName = nameParts[0] || "";
            const lastName = nameParts[nameParts.length - 1] || "";
            const middleName =
              nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

            navigate("/signup", {
              state: {
                firstName,
                middleName,
                lastName,
                email: user.email,
              },
            });
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        }
      } else {
        console.error('Unexpected user type or missing email:', user);
      }
    };

    if (user) {
      checkProfileComplete();
    }
  }, [user, checkUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {loading ? (
        <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
          <LoadingAnimation />
        </div>
      ) : (
        <>
          {!hideNavbar && <Navbar />}
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;

