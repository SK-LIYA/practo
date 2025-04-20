
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { signIn, signUp } = useAuth();

  const handleAuthSubmit = async (data: any, type: 'login' | 'register') => {
    try {
      if (type === 'login') {
        await signIn(data.email, data.password);
      } else {
        await signUp(data.email, data.password, data.name.split(' ')[0], data.name.split(' ')[1] || '');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">Welcome to MedicHub Connect</h1>
            <AuthForm onSubmit={handleAuthSubmit} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
