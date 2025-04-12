
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Protect this route - redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, don't render the dashboard
  if (!user) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="bg-card border rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="bg-muted/50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.user_metadata?.full_name || user.email}</h2>
            <p className="text-muted-foreground mb-4">
              You are now logged in to your account. This is your personal dashboard.
            </p>
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/')}>Go Home</Button>
              <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Account Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                  <dd>{user.email}</dd>
                </div>
                {user.user_metadata?.full_name && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                    <dd>{user.user_metadata.full_name}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Sign In</dt>
                  <dd>{new Date(user.last_sign_in_at || '').toLocaleString()}</dd>
                </div>
              </dl>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
