
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="inline-block bg-secondary p-4 rounded-full mb-6">
          <Heart className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for is not available.
        </p>
        <p className="text-gray-500 mb-8">
          The page may have been moved, deleted, or never existed. Let's get you back on track.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/">Return to Home</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/find-doctors">Find Doctors</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
