
import { Link } from "react-router-dom";
import { Star, Clock, MapPin, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";

type Doctor = Database['public']['Tables']['doctors']['Row'];

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-shrink-0">
            <img 
              src={doctor.image || '/placeholder.svg'} 
              alt={doctor.name} 
              className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
            />
          </div>

          <div className="flex-grow space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-xl">{doctor.name}</h3>
                  <p className="text-gray-500">{doctor.specialty}</p>
                </div>
                {doctor.available_today && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Available Today
                  </Badge>
                )}
              </div>

              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm ml-1 font-medium">{doctor.rating}</span>
                <span className="text-sm text-gray-500 ml-1">({doctor.review_count})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-gray-600">
                <ThumbsUp className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.experience} experience</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.location}</span>
              </div>
              <div className="font-medium">
                Consultation fee: ${doctor.price}
              </div>
            </div>

            {doctor.features && (
              <div className="flex flex-wrap gap-2">
                {doctor.features.map((feature, index) => (
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
                <Link to={`/doctor/${doctor.id}/profile`}>View Profile</Link>
              </Button>
              <Button 
                className="flex-1"
                asChild
              >
                <Link to={`/doctor/${doctor.id}/book`}>Book Appointment</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
