
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  avatar?: string;
  specialty?: string;
}

const Chat = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!doctorId) {
        navigate("/profile");
        return;
      }

      try {
        setIsLoading(true);
        
        // In a real app, you would fetch doctor data from a doctors table
        // For this demo, we'll create a mock doctor
        const mockDoctor: Doctor = {
          id: doctorId,
          name: "Dr. Sarah Johnson",
          specialty: "Cardiologist",
        };
        
        setDoctor(mockDoctor);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load doctor information",
        });
        navigate("/profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!doctor || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Chat not available</h1>
            <p className="mb-6 text-gray-600">The doctor you're looking for cannot be found.</p>
            <Button onClick={() => navigate("/profile")}>Return to Profile</Button>
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
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <h1 className="text-2xl font-bold mb-2">Chat with {doctor.name}</h1>
          {doctor.specialty && (
            <p className="text-gray-600 mb-6">{doctor.specialty}</p>
          )}
          
          <ChatInterface 
            recipientId={doctor.id}
            recipientName={doctor.name}
            recipientAvatar={doctor.avatar}
          />
          
          <div className="mt-6 bg-blue-50 text-blue-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">About secure messaging</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>This secure messaging system is for non-urgent communications</li>
              <li>Doctors typically respond within 1-2 business days</li>
              <li>For medical emergencies, please call emergency services</li>
              <li>All messages are encrypted and stored securely</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
