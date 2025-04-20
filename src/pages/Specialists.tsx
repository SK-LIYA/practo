
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpecialistCard } from "@/components/specialists/SpecialistCard";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Specialist = Database['public']['Tables']['specialists']['Row'];

const Specialists = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    fetchSpecialists();
  }, [selectedSpecialty]);

  useEffect(() => {
    fetchAllSpecialties();
  }, []);

  const fetchAllSpecialties = async () => {
    try {
      const { data, error } = await supabase
        .from('specialists')
        .select('specialty')
        .order('specialty');
      
      if (error) throw error;
      
      // Extract unique specialties
      const uniqueSpecialties = [...new Set(data?.map(item => item.specialty))];
      setSpecialties(uniqueSpecialties);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const fetchSpecialists = async () => {
    try {
      let query = supabase.from('specialists').select('*');
      
      if (selectedSpecialty) {
        query = query.eq('specialty', selectedSpecialty);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setSpecialists(data || []);
    } catch (error) {
      console.error('Error fetching specialists:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Medical Specialists</h1>
          
          <div className="mb-6">
            <label htmlFor="specialty-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Specialty
            </label>
            <select 
              id="specialty-filter"
              className="w-full p-2 border rounded"
              value={selectedSpecialty || ''}
              onChange={(e) => setSelectedSpecialty(e.target.value || null)}
            >
              <option value="">All Specialists</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading specialists...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialists.map(specialist => (
                <SpecialistCard key={specialist.id} specialist={specialist} />
              ))}
            </div>
          )}

          {!loading && specialists.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No specialists found.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Specialists;
