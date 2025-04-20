
import { Link } from "react-router-dom";
import { Star, MapPin, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type Specialist = Database['public']['Tables']['specialists']['Row'];

interface SpecialistCardProps {
  specialist: Specialist;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-shrink-0">
            <img 
              src={specialist.image || '/placeholder.svg'} 
              alt={specialist.name} 
              className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
            />
          </div>

          <div className="flex-grow space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-xl">{specialist.name}</h3>
                  <p className="text-gray-500">{specialist.specialty}</p>
                </div>
                {specialist.available_today && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Available Today
                  </Badge>
                )}
              </div>

              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm ml-1 font-medium">{specialist.rating}</span>
                <span className="text-sm text-gray-500 ml-1">({specialist.review_count})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-gray-600">
                <ThumbsUp className="h-4 w-4 mr-2 text-gray-400" />
                <span>{specialist.experience} experience</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span>{specialist.location}</span>
              </div>
              <div className="font-medium">
                Consultation fee: ${specialist.price}
              </div>
            </div>

            {specialist.features && (
              <div className="flex flex-wrap gap-2">
                {specialist.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                asChild
              >
                <Link to={`/specialist/${specialist.id}`}>View Profile</Link>
              </Button>
              <Button 
                className="flex-1"
                asChild
              >
                <Link to={`/specialist/${specialist.id}/book`}>Book Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
