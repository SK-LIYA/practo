
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MedicineCard } from "@/components/medicines/MedicineCard";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

type Medicine = Database['public']['Tables']['medicines']['Row'];

const Medicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOnlyPrescription, setShowOnlyPrescription] = useState(false);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, [selectedCategory, showOnlyPrescription, showOnlyInStock]);

  const fetchMedicines = async () => {
    try {
      let query = supabase.from('medicines').select('*');
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (showOnlyPrescription) {
        query = query.eq('prescription_required', true);
      }

      if (showOnlyInStock) {
        query = query.eq('in_stock', true);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setMedicines(data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(medicines.map(m => m.category))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Medicines Catalog</h1>
          
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select 
                id="category-filter"
                className="w-full p-2 border rounded"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end space-x-4">
              <Button 
                variant={showOnlyPrescription ? "default" : "outline"}
                onClick={() => setShowOnlyPrescription(!showOnlyPrescription)}
              >
                Prescription Only
              </Button>
              <Button 
                variant={showOnlyInStock ? "default" : "outline"}
                onClick={() => setShowOnlyInStock(!showOnlyInStock)}
              >
                In Stock
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading medicines...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map(medicine => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          )}

          {!loading && medicines.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No medicines found.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Medicines;
