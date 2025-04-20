
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const [location, setLocation] = useState("New York");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/find-doctors?location=${encodeURIComponent(location)}&search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="bg-white rounded-lg shadow-md p-2 flex flex-col md:flex-row"
    >
      <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-2 md:flex-1">
        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
        <Input 
          type="text" 
          placeholder="Your Location" 
          className="border-none shadow-none focus-visible:ring-0 flex-1"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <div className="flex items-center p-2 flex-1">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <Input 
          type="text" 
          placeholder="Search doctors, specialties..." 
          className="border-none shadow-none focus-visible:ring-0 flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Button type="submit" className="w-full mt-2 md:mt-0 md:w-auto md:ml-2">
        Search
      </Button>
    </form>
  );
}
