
import { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";

interface SearchBarProps {
  onSearch: (searchParams: any) => void;
  toggleMobileFilters?: () => void;
}

const specialties = [
  { value: "all", label: "All Specialties" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "dermatology", label: "Dermatology" },
  { value: "ophthalmology", label: "Ophthalmology" },
  { value: "dentistry", label: "Dentistry" },
  { value: "general", label: "General Medicine" },
];

export function DoctorSearchBar({ onSearch, toggleMobileFilters }: SearchBarProps) {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "New York");
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "all");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ search: searchTerm, location, specialty });
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search doctors, clinics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger>
            <SelectValue placeholder="Select Specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((spec) => (
              <SelectItem key={spec.value} value={spec.value}>
                {spec.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-4 flex flex-col md:flex-row gap-3 justify-end">
        {toggleMobileFilters && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={toggleMobileFilters}
            className="flex items-center md:hidden"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        )}
        <Button type="submit">Search Doctors</Button>
      </div>
    </form>
  );
}
