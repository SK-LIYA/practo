
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Doctor = Database['public']['Tables']['doctors']['Row'];

export function FeaturedDoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .limit(4);

        if (error) throw error;
        setDoctors(data || []);
      } catch (error) {
        console.error('Error fetching featured doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDoctors();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading featured doctors...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Doctors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Top-rated healthcare professionals trusted by thousands of patients
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden transition-all hover:shadow-md">
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={doctor.image || '/placeholder.svg'} 
                    alt={doctor.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{doctor.name}</h3>
                    <p className="text-gray-500 text-sm">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm ml-1">{doctor.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({doctor.review_count})</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Experience:</span> {doctor.experience}
                    </div>
                    {doctor.available_today && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Available Today
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{doctor.location}</p>
                  <Link to={`/doctor/${doctor.id}`}>
                    <Button className="w-full">Book Appointment</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/find-doctors"
            className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
          >
            View all doctors
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
