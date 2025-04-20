import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { format } from "date-fns";
import { Calendar, Clock, User, FileText, MessageSquare, Package, LogIn } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalRecords } from "@/components/patient/MedicalRecords";
import { Prescriptions } from "@/components/doctor/Prescriptions";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Purchase = Database['public']['Tables']['purchases']['Row'];

const Profile = () => {
  const { user, signOut } = useAuth();
  const { appointments, isLoading: isAppointmentsLoading } = useAppointments();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    if (!user) return;
    
    try {
      setLoadingPurchases(true);
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <User className="w-20 h-20 mx-auto text-gray-400 mb-6" />
            <h1 className="text-2xl font-bold mb-4">Sign in to access your profile</h1>
            <p className="text-gray-600 mb-8">
              Sign in to view your appointments, medical records, and prescriptions.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link to="/login" className="flex items-center justify-center">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In / Create Account
              </Link>
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
          
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
                
                {isAppointmentsLoading ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading appointments...</p>
                  </div>
                ) : appointments?.length === 0 ? (
                  <p className="text-gray-500">No appointments found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments?.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            {format(new Date(appointment.appointment_date), 'hh:mm a')}
                          </TableCell>
                          <TableCell>{appointment.consultation_type}</TableCell>
                          <TableCell>
                            <span className={`capitalize px-2 py-1 rounded-full text-sm ${
                              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </TableCell>
                          <TableCell>${appointment.fee}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link to={`/chat/${appointment.doctor_id}`}>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Chat
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="purchases" className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">My Purchases</h2>
                
                {loadingPurchases ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading purchases...</p>
                  </div>
                ) : purchases.length === 0 ? (
                  <p className="text-gray-500">No purchases found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Medicine</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell>
                            {format(new Date(purchase.created_at || ''), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="font-medium">{purchase.medicine_name}</TableCell>
                          <TableCell>${purchase.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="medical-records">
              <MedicalRecords />
            </TabsContent>
            
            <TabsContent value="prescriptions">
              <Prescriptions />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
