
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Video, Calendar, Clock, ArrowLeft, Copy, CheckCircle2, AlertTriangle } from "lucide-react";

interface LocationState {
  doctorName: string;
  meetingLink: string;
  appointmentDate: Date;
  appointmentTime: string;
}

const VideoConsultation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  useEffect(() => {
    if (!state || !state.doctorName || !state.meetingLink) {
      toast.error("Missing consultation information");
      navigate("/profile");
    }
  }, [state, navigate]);
  
  if (!state) return null;
  
  const { doctorName, meetingLink, appointmentDate, appointmentTime } = state;
  
  const formattedDate = appointmentDate instanceof Date 
    ? appointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Date unavailable';
  
  const handleCopyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
    toast.success("Meeting link copied to clipboard");
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
                  <CardTitle className="text-2xl">Video Consultation</CardTitle>
                  <CardDescription>Video call details for your appointment with {doctorName}</CardDescription>
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
                    <h3 className="text-lg font-medium">Meeting Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Video className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Meeting Link</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate max-w-[200px]">{meetingLink}</p>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={handleCopyMeetingLink}
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
                    <li>Click the "Join Video Call" button at your scheduled appointment time.</li>
                    <li>Allow browser access to your camera and microphone when prompted.</li>
                    <li>Wait in the virtual waiting room until the doctor admits you.</li>
                    <li>The consultation will last approximately 30 minutes.</li>
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
                onClick={() => window.open(meetingLink, '_blank')}
              >
                <Video className="h-4 w-4" />
                <span>Join Video Call</span>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Before Your Call</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p>Test your camera and microphone ahead of time</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p>Find a quiet, well-lit space with stable internet</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p>Prepare a list of symptoms and questions</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p>Have your current medications ready</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Technical Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Supported Browsers</p>
                    <p className="text-gray-600">Chrome, Firefox, Safari, Edge</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Internet Speed</p>
                    <p className="text-gray-600">At least 1 Mbps upload/download</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Devices</p>
                    <p className="text-gray-600">Computer, tablet, or smartphone with camera</p>
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

export default VideoConsultation;
