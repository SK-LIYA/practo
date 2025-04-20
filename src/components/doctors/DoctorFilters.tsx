
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FiltersProps {
  onFilterChange: (filters: any) => void;
}

export function DoctorFilters({ onFilterChange }: FiltersProps) {
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([]);
  const [genderFilter, setGenderFilter] = useState<string[]>([]);
  const [experienceRange, setExperienceRange] = useState([0, 30]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  
  const handleAvailabilityChange = (value: string) => {
    setAvailabilityFilter(prev => {
      const newFilters = prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value];
      
      onFilterChange({ availability: newFilters, gender: genderFilter, experience: experienceRange, price: priceRange });
      return newFilters;
    });
  };

  const handleGenderChange = (value: string) => {
    setGenderFilter(prev => {
      const newFilters = prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value];
      
      onFilterChange({ availability: availabilityFilter, gender: newFilters, experience: experienceRange, price: priceRange });
      return newFilters;
    });
  };

  const handleExperienceChange = (value: number[]) => {
    setExperienceRange(value);
    onFilterChange({ 
      availability: availabilityFilter, 
      gender: genderFilter, 
      experience: value, 
      price: priceRange 
    });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange({ 
      availability: availabilityFilter, 
      gender: genderFilter, 
      experience: experienceRange, 
      price: value 
    });
  };

  const resetFilters = () => {
    setAvailabilityFilter([]);
    setGenderFilter([]);
    setExperienceRange([0, 30]);
    setPriceRange([0, 200]);
    onFilterChange({ 
      availability: [], 
      gender: [], 
      experience: [0, 30], 
      price: [0, 200] 
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="text-primary hover:text-primary/80 h-auto p-0"
        >
          Reset All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["availability", "gender", "experience", "price"]}>
        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="availability-today" 
                  checked={availabilityFilter.includes('today')}
                  onCheckedChange={() => handleAvailabilityChange('today')}
                />
                <label htmlFor="availability-today" className="text-sm font-medium cursor-pointer">
                  Available Today
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="availability-tomorrow" 
                  checked={availabilityFilter.includes('tomorrow')}
                  onCheckedChange={() => handleAvailabilityChange('tomorrow')}
                />
                <label htmlFor="availability-tomorrow" className="text-sm font-medium cursor-pointer">
                  Available Tomorrow
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="availability-weekend" 
                  checked={availabilityFilter.includes('weekend')}
                  onCheckedChange={() => handleAvailabilityChange('weekend')}
                />
                <label htmlFor="availability-weekend" className="text-sm font-medium cursor-pointer">
                  Available on Weekend
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gender">
          <AccordionTrigger>Gender</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gender-male" 
                  checked={genderFilter.includes('male')}
                  onCheckedChange={() => handleGenderChange('male')}
                />
                <label htmlFor="gender-male" className="text-sm font-medium cursor-pointer">
                  Male
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gender-female" 
                  checked={genderFilter.includes('female')}
                  onCheckedChange={() => handleGenderChange('female')}
                />
                <label htmlFor="gender-female" className="text-sm font-medium cursor-pointer">
                  Female
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>Years of Experience</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={[0, 30]}
                value={experienceRange}
                max={30}
                step={1}
                onValueChange={handleExperienceChange}
              />
              <div className="flex justify-between text-sm">
                <span>{experienceRange[0]} years</span>
                <span>{experienceRange[1]} years</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Consultation Fee</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={[0, 200]}
                value={priceRange}
                max={200}
                step={5}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
