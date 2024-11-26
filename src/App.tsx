  import Navbar from "./components/Navbar";
  import { Outlet, useLocation } from "react-router-dom";
  import Footer from "./components/Footer";

  function App() {
    const location = useLocation();
    const hideNavbar = ["/login", "/sign-up"].includes(location.pathname);

    return (
      <div className="">
        {!hideNavbar && <Navbar />}
        <Outlet />
        <Footer />
      </div>
    );
  }

  export default App;
