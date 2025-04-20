
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

interface AuthFormProps {
  onSubmit?: (data: any, type: 'login' | 'register') => void;
}

export function AuthForm({ onSubmit }: AuthFormProps) {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit && onSubmit(loginData, 'login');
  };
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit && onSubmit(registerData, 'register');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-md mx-auto">
      <Tabs defaultValue="login">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLoginSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <Input 
                  id="login-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Login</Button>
            </div>
          </form>
          
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 mb-4">Or continue with</p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="space-x-2 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                <span>Facebook</span>
              </Button>
              <Button variant="outline" type="button" className="space-x-2 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                <span>Google</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleRegisterSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input 
                  id="register-name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input 
                  id="register-email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input 
                  id="register-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirm Password</Label>
                <Input 
                  id="register-confirm-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Register</Button>
            </div>
          </form>
          
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              By registering, you agree to our 
              <Link to="/terms" className="text-primary hover:underline mx-1">Terms of Service</Link>
              and
              <Link to="/privacy" className="text-primary hover:underline ml-1">Privacy Policy</Link>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
