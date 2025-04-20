
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Star, MapPin, ThumbsUp, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useToast } from "@/hooks/use-toast";

type Specialist = Database['public']['Tables']['specialists']['Row'];

const SpecialistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchSpecialist(id);
    }
  }, [id]);

  const fetchSpecialist = async (specialistId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('specialists')
        .select('*')
        .eq('id', specialistId)
        .single();

      if (error) throw error;
      setSpecialist(data || null);
    } catch (error) {
      console.error('Error fetching specialist details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultation = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a consultation",
        variant: "destructive"
      });
      return;
    }

    if (!specialist || !selectedDate) {
      toast({
        title: "Select Date",
        description: "Please select a date for your consultation",
        variant: "destructive"
      });
      return;
    }

    try {
      await createAppointment.mutateAsync({
        doctor_id: specialist.id,
        appointment_date: new Date(selectedDate).toISOString(),
        consultation_type: "in-person",
        fee: specialist.price || 0
      });

      toast({
        title: "Consultation Booked",
        description: "Your consultation has been successfully scheduled.",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your consultation. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Generate some available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading specialist profile...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!specialist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-gray-600">Specialist not found.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={specialist.image || '/placeholder.svg'} 
                    alt={specialist.name} 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto md:mx-0"
                  />
                </div>

                <div className="flex-grow space-y-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{specialist.name}</h1>
                    <p className="text-lg text-gray-500">{specialist.specialty} Specialist</p>
                    
                    <div className="flex items-center mt-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{specialist.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({specialist.review_count} reviews)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <ThumbsUp className="h-5 w-5 mr-2 text-gray-400" />
                      <span>{specialist.experience} experience</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                      <span>{specialist.location}</span>
                    </div>
                  </div>

                  {specialist.features && (
                    <div className="flex flex-wrap gap-2">
                      {specialist.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:text-right space-y-3 md:min-w-32">
                  <div className="p-3 border rounded-md text-center">
                    <p className="text-sm text-gray-500">Consultation Fee</p>
                    <p className="text-xl font-bold text-primary">${specialist.price}</p>
                  </div>
                  {specialist.available_today && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Available Today
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t">
              <Tabs defaultValue="overview" className="w-full">
                <div className="px-6 md:px-8 border-b">
                  <TabsList className="bg-transparent border-b-0">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="book">Book Appointment</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="px-6 md:px-8 py-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">About</h2>
                      <p className="text-gray-600">
                        Dr. {specialist.name} is a highly qualified {specialist.specialty} specialist with {specialist.experience} of experience in the field. 
                        They specialize in treating various conditions and have helped numerous patients throughout their career.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-3">Education & Training</h2>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>MD in {specialist.specialty}, Medical University</li>
                        <li>Residency at General Hospital</li>
                        <li>Fellowship in Advanced {specialist.specialty}</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-3">Specializations</h2>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>General {specialist.specialty} care</li>
                        <li>Advanced {specialist.specialty} procedures</li>
                        <li>Emergency {specialist.specialty} conditions</li>
                        <li>Chronic {specialist.specialty} management</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="book" className="px-6 md:px-8 py-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Book a Consultation</h2>
                      <p className="text-gray-600 mb-4">
                        Select a date and time for your consultation with Dr. {specialist.name}.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-3">Available Dates</h3>
                          <div className="space-y-2">
                            {availableDates.map((date) => (
                              <div 
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                                  selectedDate === date ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                                }`}
                              >
                                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                                <span>{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Consultation Details</h3>
                          <div className="p-4 border rounded-md space-y-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Specialist:</span>
                              <span className="font-medium">{specialist.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Specialty:</span>
                              <span>{specialist.specialty}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Fee:</span>
                              <span className="font-medium">${specialist.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date:</span>
                              <span>{selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Select a date'}</span>
                            </div>

                            <Button 
                              className="w-full mt-4"
                              onClick={handleBookConsultation}
                              disabled={!selectedDate}
                            >
                              Book Consultation
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="px-6 md:px-8 py-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Patient Reviews</h2>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-medium">{specialist.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({specialist.review_count} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Sample reviews */}
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-semibold">
                              JD
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">John Doe</p>
                              <p className="text-sm text-gray-500">3 months ago</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          </div>
                        </div>
                        <p className="text-gray-600">
                          Dr. {specialist.name} was very professional and knowledgeable. They took the time to explain my condition thoroughly and answered all my questions. Highly recommended!
                        </p>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-semibold">
                              JS
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">Jane Smith</p>
                              <p className="text-sm text-gray-500">1 month ago</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                        </div>
                        <p className="text-gray-600">
                          Great experience with Dr. {specialist.name}. The consultation was thorough and they provided clear guidance for my treatment plan.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpecialistProfile;
