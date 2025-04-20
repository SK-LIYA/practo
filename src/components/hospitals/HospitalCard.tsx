
import { Link } from "react-router-dom";
import { Star, MapPin, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type Hospital = Database['public']['Tables']['hospitals']['Row'];

interface HospitalCardProps {
  hospital: Hospital;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-shrink-0">
            <img 
              src={hospital.image || '/placeholder.svg'} 
              alt={hospital.name} 
              className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
            />
          </div>

          <div className="flex-grow space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xl">{hospital.name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{hospital.location}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm ml-1 font-medium">{hospital.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({hospital.review_count})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mt-2">
              <Phone className="h-4 w-4 mr-2" />
              <span>{hospital.phone}</span>
            </div>

            {hospital.departments && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Departments</h4>
                <div className="flex flex-wrap gap-2">
                  {hospital.departments.map((department, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {department}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {hospital.features && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {hospital.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                asChild
              >
                <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </Button>
              <Button 
                className="flex-1"
                asChild
              >
                <Link to={`/hospital/${hospital.id}`}>More Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
