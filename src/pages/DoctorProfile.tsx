import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentSlots } from "@/components/booking/AppointmentSlots";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Star, ThumbsUp, Award, CheckCircle2, Video, Phone, MessageSquare, FileText, User } from "lucide-react";

const doctorData = {
  id: 1,
  name: "Dr. Emily Johnson",
  specialty: "Cardiologist",
  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=300&auto=format&fit=crop",
  rating: 4.9,
  reviewCount: 127,
  experience: "15 years",
  location: "New York Medical Center, 123 Medical Ave, New York, NY",
  price: "$150",
  about: "Dr. Emily Johnson is a board-certified cardiologist with over 15 years of experience in diagnosing and treating heart conditions. She specializes in preventive cardiology, heart failure management, and cardiovascular imaging. Dr. Johnson completed her medical degree at Harvard Medical School and her cardiology fellowship at Massachusetts General Hospital.",
  education: [
    { degree: "M.D.", institution: "Harvard Medical School", year: "2005" },
    { degree: "Residency, Internal Medicine", institution: "Johns Hopkins Hospital", year: "2008" },
    { degree: "Fellowship, Cardiology", institution: "Massachusetts General Hospital", year: "2011" }
  ],
  specializations: [
    "Preventive Cardiology",
    "Heart Failure Management",
    "Cardiovascular Imaging",
    "Coronary Artery Disease",
    "Hypertension Management"
  ],
  consultationTypes: [
    { type: "In-person", price: "$150", duration: "30 minutes" },
    { type: "Video", price: "$120", duration: "30 minutes", link: "https://meet.google.com/abc-defg-hij" },
    { type: "Phone", price: "$100", duration: "20 minutes", phoneNumber: "9999999999" }
  ],
  languages: ["English", "Spanish"],
  reviews: [
    { 
      id: 1, 
      patient: "Sarah M.", 
      rating: 5, 
      date: "2 weeks ago", 
      comment: "Dr. Johnson was thorough, compassionate, and explained everything clearly. She took the time to answer all my questions and put me at ease. I highly recommend her!" 
    },
    { 
      id: 2, 
      patient: "Robert K.", 
      rating: 5, 
      date: "1 month ago", 
      comment: "Excellent doctor who really listens to patients. Dr. Johnson provided me with a comprehensive treatment plan and has been very responsive to my follow-up questions." 
    },
    { 
      id: 3, 
      patient: "Linda T.", 
      rating: 4, 
      date: "2 months ago", 
      comment: "Very knowledgeable and professional. Wait time was a bit longer than expected, but the quality of care was worth it." 
    }
  ],
  awards: [
    "American Heart Association Scientific Excellence Award, 2019",
    "Top Cardiologist, New York Medical Society, 2018-2022",
    "Patient's Choice Award, 2020"
  ]
};

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const [selectedConsultationType, setSelectedConsultationType] = useState("In-person");
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date, time: string } | null>(null);
  
  const handleSelectSlot = (date: Date, time: string) => {
    setSelectedSlot({ date, time });
  };
  
  const handleBookAppointment = async () => {
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please log in to book an appointment"
      });
      navigate("/login");
      return;
    }

    if (!selectedSlot) {
      toast.error("Select a Time Slot", {
        description: "Please select a date and time for your appointment"
      });
      return;
    }

    try {
      const selectedConsultationData = doctorData.consultationTypes.find(
        c => c.type === selectedConsultationType
      );

      if (!selectedConsultationData) {
        throw new Error("Invalid consultation type");
      }

      await createAppointment.mutateAsync({
        doctor_id: id!,
        consultation_type: selectedConsultationType,
        appointment_date: new Date(
          selectedSlot.date.getFullYear(),
          selectedSlot.date.getMonth(),
          selectedSlot.date.getDate(),
          parseInt(selectedSlot.time.split(':')[0]),
          parseInt(selectedSlot.time.split(':')[1])
        ).toISOString(),
        fee: parseFloat(selectedConsultationData.price.replace('$', '')),
      });

      if (selectedConsultationType === "Phone") {
        toast.success("Appointment Booked", {
          description: `Your phone consultation has been scheduled. Doctor will call you at your appointment time.`
        });
        navigate('/consultation/phone', { 
          state: { 
            doctorName: doctorData.name, 
            doctorPhone: selectedConsultationData.phoneNumber, 
            appointmentDate: selectedSlot.date,
            appointmentTime: selectedSlot.time
          } 
        });
      } else if (selectedConsultationType === "Video") {
        toast.success("Appointment Booked", {
          description: `Your video consultation has been scheduled. Use the provided link at your appointment time.`
        });
        navigate('/consultation/video', { 
          state: { 
            doctorName: doctorData.name, 
            meetingLink: selectedConsultationData.link,
            appointmentDate: selectedSlot.date,
            appointmentTime: selectedSlot.time
          } 
        });
      } else {
        toast.success("Appointment Booked", {
          description: "Your appointment has been successfully scheduled."
        });
        navigate('/profile');
      }
    } catch (error) {
      toast.error("Error Booking Appointment", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={doctorData.image} 
                    alt={doctorData.name} 
                    className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold">{doctorData.name}</h1>
                      <p className="text-gray-600">{doctorData.specialty}</p>
                      
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm ml-1 font-medium">{doctorData.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({doctorData.reviewCount} reviews)</span>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center text-gray-600">
                          <ThumbsUp className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{doctorData.experience} experience</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{doctorData.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Usually responds within 1 hour</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 md:text-right">
                      <p className="font-semibold text-lg">Consultation fee from</p>
                      <p className="text-primary text-2xl font-bold">{doctorData.price}</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          <span>Call Clinic</span>
                        </Button>
                        <Button
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Book Appointment</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">About {doctorData.name}</h2>
                      <p className="text-gray-700">{doctorData.about}</p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Education & Training</h2>
                      <div className="space-y-3">
                        {doctorData.education.map((edu, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              <p className="font-medium">{edu.degree}</p>
                              <p className="text-gray-600">{edu.institution}, {edu.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Specializations</h2>
                      <div className="flex flex-wrap gap-2">
                        {doctorData.specializations.map((spec, index) => (
                          <span 
                            key={index} 
                            className="bg-secondary text-primary px-3 py-1 rounded-full text-sm"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Awards & Recognitions</h2>
                      <div className="space-y-3">
                        {doctorData.awards.map((award, index) => (
                          <div key={index} className="flex items-start">
                            <Award className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                            <p>{award}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Languages</h2>
                      <div className="flex flex-wrap gap-2">
                        {doctorData.languages.map((lang, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Patient Reviews</h2>
                      <select className="text-sm border rounded p-1">
                        <option>Most Recent</option>
                        <option>Highest Rated</option>
                        <option>Lowest Rated</option>
                      </select>
                    </div>
                    
                    <div className="space-y-4">
                      {doctorData.reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <div className="bg-gray-100 p-2 rounded-full mr-3">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium">{review.patient}</p>
                                <p className="text-gray-500 text-sm">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-3 text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Show More Reviews
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="location" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Practice Locations</h2>
                    
                    <div className="border border-gray-100 rounded-lg p-4">
                      <h3 className="font-medium mb-2">New York Medical Center</h3>
                      <p className="text-gray-600 mb-2">123 Medical Ave, New York, NY 10001</p>
                      <p className="text-gray-600 mb-4">
                        <span className="font-medium">Office Hours:</span> Mon-Fri 9AM-5PM, Sat 10AM-2PM
                      </p>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Map Placeholder</p>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <Button variant="outline" size="sm">Get Directions</Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div id="booking-section" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Consultation Options</h2>
                
                <div className="space-y-3">
                  {doctorData.consultationTypes.map((consultation) => (
                    <div 
                      key={consultation.type}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedConsultationType === consultation.type 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedConsultationType(consultation.type)}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          selectedConsultationType === consultation.type 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {consultation.type === 'In-person' && <User className="h-5 w-5" />}
                          {consultation.type === 'Video' && <Video className="h-5 w-5" />}
                          {consultation.type === 'Phone' && <Phone className="h-5 w-5" />}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{consultation.type} Consultation</h3>
                            <p className="font-semibold text-primary">{consultation.price}</p>
                          </div>
                          <p className="text-gray-600 text-sm">Duration: {consultation.duration}</p>
                          {consultation.type === 'Phone' && (
                            <p className="text-gray-600 text-sm mt-1">Doctor will call you directly</p>
                          )}
                          {consultation.type === 'Video' && (
                            <p className="text-gray-600 text-sm mt-1">Via secure video platform</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <AppointmentSlots onSelectSlot={handleSelectSlot} />
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Appointment Summary</h3>
                
                {selectedSlot ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor</span>
                      <span className="font-medium">{doctorData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consultation Type</span>
                      <span className="font-medium">{selectedConsultationType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{selectedSlot.date.toDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">{selectedSlot.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee</span>
                      <span className="font-medium text-primary">
                        {doctorData.consultationTypes.find(c => c.type === selectedConsultationType)?.price}
                      </span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <Button className="w-full" onClick={handleBookAppointment}>
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Please select a date and time slot to continue
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DoctorProfile;
