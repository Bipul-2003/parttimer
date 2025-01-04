import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  const { checkUser, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileComplete = async () => {
      // Ensure the user is not null and is an object
      if (!user) {
        console.error('User is not defined');
        return;
      }

      // Check if user_type exists and is LABOUR
      if ('user_type' in user && user.user_type === "LABOUR") {
        return;
      }

      // Perform the profile completeness check for regular users
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

    // Run the profile check for all users
    if (user) {
      checkProfileComplete();
    }
  }, [user, checkUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ensure all JSX elements are correctly structured */}
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl font-bold">Loading...</div>
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

