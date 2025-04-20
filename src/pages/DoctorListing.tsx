
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DoctorFilters } from "@/components/doctors/DoctorFilters";
import { DoctorSearchBar } from "@/components/doctors/DoctorSearchBar";
import { DoctorCard } from "@/components/doctors/DoctorCard"; // Add this import
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Doctor = Database['public']['Tables']['doctors']['Row'];

const DoctorListing = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDoctors();
  }, [searchParams]);
  
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const search = searchParams.get("search");
      const location = searchParams.get("location");
      const specialty = searchParams.get("specialty");

      let query = supabase.from('doctors').select('*');

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }
      if (specialty && specialty !== 'all') {
        query = query.ilike('specialty', `%${specialty}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (searchParams: any) => {
    fetchDoctors();
  };
  
  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };
  
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Find Doctors in Your Area</h1>
          
          <DoctorSearchBar onSearch={handleSearch} toggleMobileFilters={toggleMobileFilters} />
          
          <div className="flex flex-col md:flex-row gap-6">
            {showMobileFilters && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
                <div className="bg-white h-full w-80 p-4 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button variant="ghost" size="sm" onClick={toggleMobileFilters}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <DoctorFilters onFilterChange={handleFilterChange} />
                </div>
              </div>
            )}
            
            <div className="hidden md:block md:w-1/4 lg:w-1/5">
              <DoctorFilters onFilterChange={handleFilterChange} />
            </div>
            
            <div className="md:w-3/4 lg:w-4/5">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  {doctors.length} doctors found
                </p>
                <div className="flex items-center">
                  <span className="text-sm mr-2">Sort by:</span>
                  <select className="text-sm border rounded p-1">
                    <option>Relevance</option>
                    <option>Rating: High to Low</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Experience</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading doctors...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {doctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DoctorListing;
