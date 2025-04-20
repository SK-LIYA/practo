
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Hospital = Database['public']['Tables']['hospitals']['Row'];

const Hospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    fetchHospitals();
  }, [selectedLocation]);

  const fetchHospitals = async () => {
    try {
      let query = supabase.from('hospitals').select('*');
      
      if (selectedLocation) {
        query = query.ilike('location', `%${selectedLocation}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const locations = [...new Set(hospitals.map(h => h.location.split(',')[0].trim()))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Hospitals Network</h1>
          
          <div className="mb-6">
            <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Location
            </label>
            <select 
              id="location-filter"
              className="w-full p-2 border rounded"
              value={selectedLocation || ''}
              onChange={(e) => setSelectedLocation(e.target.value || null)}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading hospitals...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map(hospital => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))}
            </div>
          )}

          {!loading && hospitals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No hospitals found.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Hospitals;
