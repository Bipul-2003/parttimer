import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  const { checkUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileComplete = async () => {
      // Ensure the user is not null
      if (!user) return;
  
      // Skip the check for LABOUR user type
      if ('user_type' in user && user.user_type === "LABOUR") {
        return;
      }
  
      // Perform the profile completeness check for regular users
      if ('email' in user) {
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
      }
    };
  
    // Run the profile check for all users
    if (user) {
      checkProfileComplete();
    }
  }, [user, checkUser, navigate]);

  return (
    <div className="">
      {!hideNavbar && <Navbar />}
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;

