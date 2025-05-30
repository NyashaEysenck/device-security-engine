
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-background">
      <div className="text-center px-6">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Shield className="h-20 w-20 text-cyber-accent/50" />
            <AlertTriangle className="h-10 w-10 text-cyber-warning absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Security breach detected. Access denied.</p>
        <Link to="/">
          <Button className="bg-cyber-accent hover:bg-opacity-80">
            Return to Secure Zone
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
