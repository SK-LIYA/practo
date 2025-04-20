
import { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Medicine = Database['public']['Tables']['medicines']['Row'];
type Purchase = Database['public']['Tables']['purchases']['Insert'];

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to purchase medicines",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    if (medicine.prescription_required) {
      toast({
        title: "Prescription Required",
        description: "This medicine requires a prescription",
        variant: "destructive"
      });
      return;
    }

    try {
      const purchaseData: Purchase = {
        user_id: user.id,
        medicine_id: medicine.id,
        medicine_name: medicine.name,
        price: medicine.price || 0
      };

      const { error } = await supabase
        .from('purchases')
        .insert([purchaseData]);

      if (error) throw error;

      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${medicine.name}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error recording purchase:', error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase",
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart`,
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-shrink-0">
            <img 
              src={medicine.image || '/placeholder.svg'} 
              alt={medicine.name} 
              className="w-24 h-24 object-cover mx-auto md:mx-0"
            />
          </div>

          <div className="flex-grow space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xl">{medicine.name}</h3>
                  <p className="text-gray-500">{medicine.manufacturer}</p>
                </div>
                {medicine.prescription_required && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Prescription Required
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <strong>Category:</strong> {medicine.category}
              </div>
              {medicine.description && (
                <p className="text-sm text-gray-600">{medicine.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="font-semibold text-lg">${medicine.price}</div>
              {medicine.in_stock ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Out of Stock
                </Badge>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                disabled={!medicine.in_stock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button 
                className="flex-1"
                disabled={medicine.prescription_required || !medicine.in_stock}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
