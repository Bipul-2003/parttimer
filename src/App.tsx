import Navbar from "./components/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  const { checkUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileComplete = async () => {
      // Ensure the user is not null
      if (!user) return;
  
      // Skip the check for LABOUR role
      if (user.user_role === "LABOUR") {
        return;
      }
  
      // Perform the profile completeness check
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
    };
  
    // Only run the profile check if the user is not LABOUR
    if (user && user.user_role !== "LABOUR") {
      checkProfileComplete();
    }
  }, [user]);

  return (
    <div className="">
      {!hideNavbar && <Navbar />}
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
