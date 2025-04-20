
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Star, MapPin, Phone, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Hospital = Database['public']['Tables']['hospitals']['Row'];
type Doctor = Database['public']['Tables']['doctors']['Row'];

const HospitalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchHospitalAndDoctors = async () => {
      try {
        setLoading(true);
        
        // Fetch hospital details
        const { data: hospitalData, error: hospitalError } = await supabase
          .from('hospitals')
          .select('*')
          .eq('id', id)
          .single();
        
        if (hospitalError) throw hospitalError;
        setHospital(hospitalData);
        
        // Fetch doctors for this hospital location
        if (hospitalData?.location) {
          const { data: doctorsData, error: doctorsError } = await supabase
            .from('doctors')
            .select('*')
            .ilike('location', `%${hospitalData.location.split(',')[0]}%`)
            .limit(6);
          
          if (doctorsError) throw doctorsError;
          setDoctors(doctorsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHospitalAndDoctors();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading hospital information...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-8">
              <p className="text-gray-600">Hospital not found.</p>
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 md:h-64 bg-gray-200">
              <img 
                src={hospital.image || '/placeholder.svg'} 
                alt={hospital.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-3xl font-bold text-white">{hospital.name}</h1>
                <div className="flex items-center text-white mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{hospital.location}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">{hospital.rating}</span>
                  <span className="text-gray-500 ml-1">({hospital.review_count} reviews)</span>
                </div>
                {hospital.phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 mr-1" />
                    <span>{hospital.phone}</span>
                  </div>
                )}
                {hospital.website && (
                  <div className="flex items-center text-primary">
                    <Globe className="h-5 w-5 mr-1" />
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer">{hospital.website}</a>
                  </div>
                )}
              </div>
              
              {hospital.departments && hospital.departments.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Departments</h2>
                  <div className="flex flex-wrap gap-2">
                    {hospital.departments.map((department, index) => (
                      <Badge key={index} variant="secondary">
                        {department}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {hospital.features && hospital.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Features & Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {hospital.features.map((feature, index) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Doctors at {hospital.name}</h2>
                {doctors.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {doctors.map(doctor => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No doctors found for this hospital.</p>
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

export default HospitalDetail;
