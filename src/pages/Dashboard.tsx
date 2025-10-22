import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import SeekerDashboard from './dashboard/SeekerDashboard';
import OwnerDashboard from './dashboard/OwnerDashboard';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'owner':
      return <OwnerDashboard />;
    case 'seeker':
      return <SeekerDashboard />;
    case 'admin':
      return <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Admin features coming soon</p>
      </div>;
    default:
      return <SeekerDashboard />;
  }
};

export default Dashboard;
