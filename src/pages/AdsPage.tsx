import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";

function AdsPage() {
  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className=" shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            {/* <Button variant="ghost">Home</Button> */}
          </Link>
          <div>
            <Link to="/advertisement/publish-ad">
              <Button variant="outline" className="mr-2">
                Publish Ad
              </Button>
            </Link>
            <Link to="/advertisement/my-ads">
              <Button variant="outline">My Ads</Button>
            </Link>
          </div>
        </div>
      </nav>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default AdsPage;
