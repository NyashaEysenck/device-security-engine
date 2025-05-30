
import { Navigate } from 'react-router-dom';

// Redirect from the index page to the dashboard page
const Index = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Index;
