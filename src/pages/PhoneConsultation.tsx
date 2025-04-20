
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Phone, Calendar, Clock, ArrowLeft, Copy } from "lucide-react";

interface LocationState {
  doctorName: string;
  doctorPhone: string;
  appointmentDate: Date;
  appointmentTime: string;
}

const PhoneConsultation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  useEffect(() => {
    if (!state || !state.doctorName || !state.doctorPhone) {
      toast.error("Missing consultation information");
      navigate("/profile");
    }
  }, [state, navigate]);
  
  if (!state) return null;
  
  const { doctorName, doctorPhone, appointmentDate, appointmentTime } = state;
  
  const formattedDate = appointmentDate instanceof Date 
    ? appointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Date unavailable';
  
  const handleCopyPhoneNumber = () => {
    navigator.clipboard.writeText(doctorPhone);
    toast.success("Phone number copied to clipboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <Card className="mb-6">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Phone Consultation</CardTitle>
                  <CardDescription>Call details for your appointment with {doctorName}</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 pb-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Appointment Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">{formattedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium">{appointmentTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Doctor Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{doctorPhone}</p>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={handleCopyPhoneNumber}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">How it works:</h4>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>The doctor will call you directly at the scheduled time.</li>
                    <li>Please make sure you're in a quiet place with good reception.</li>
                    <li>Have your medical information and any questions ready.</li>
                    <li>The call will last approximately 20 minutes.</li>
                  </ol>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t bg-gray-50 pt-4">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                View All Appointments
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => window.open(`tel:${doctorPhone}`)}
              >
                <Phone className="h-4 w-4" />
                <span>Call Doctor</span>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Preparing for Your Phone Consultation</h3>
            <div className="space-y-4">
              <p>
                To make the most of your phone consultation with {doctorName}, please follow these recommendations:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Before the Call</h4>
                    <p className="text-gray-600">
                      Make a list of your symptoms, concerns, and questions. Have your medication list ready.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">During the Call</h4>
                    <p className="text-gray-600">
                      Find a quiet space with good phone reception. Take notes during the conversation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">After the Call</h4>
                    <p className="text-gray-600">
                      Follow the doctor's recommendations. Schedule follow-up visits if needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PhoneConsultation;
