
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface SlotType {
  time: string;
  available: boolean;
}

interface AppointmentSlotsProps {
  onSelectSlot: (date: Date, time: string) => void;
}

export function AppointmentSlots({ onSelectSlot }: AppointmentSlotsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Generate fake time slots for demonstration
  const generateTimeSlots = (date: Date): SlotType[] => {
    // If it's a weekend, return fewer slots
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseSlots = [
      { time: "09:00 AM", available: true },
      { time: "09:30 AM", available: true },
      { time: "10:00 AM", available: false },
      { time: "10:30 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "11:30 AM", available: false },
      { time: "01:00 PM", available: true },
      { time: "01:30 PM", available: true },
      { time: "02:00 PM", available: true },
      { time: "02:30 PM", available: false },
      { time: "03:00 PM", available: true },
      { time: "03:30 PM", available: false },
    ];
    
    if (isWeekend) {
      return baseSlots.slice(0, 6); // Only morning slots on weekends
    }
    
    return baseSlots;
  };
  
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelectSlot(selectedDate, time);
    }
  };
  
  // Function to disable past dates and highlight available dates
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Select Appointment Date & Time</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Calendar 
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabledDays}
            className="rounded-md border"
          />
        </div>
        
        <div>
          <h4 className="text-md font-medium mb-4 flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Available Time Slots
          </h4>
          
          {selectedDate ? (
            timeSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    className={`
                      ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}
                      ${selectedTime === slot.time ? 'ring-2 ring-primary' : ''}
                    `}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No available slots for this date.</p>
            )
          ) : (
            <p className="text-gray-500">Please select a date to view available slots.</p>
          )}
          
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center">
              <Badge variant="outline" className="bg-white mr-2"></Badge>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="bg-white opacity-50 mr-2"></Badge>
              <span className="text-sm">Booked</span>
            </div>
            <div className="flex items-center">
              <Badge className="mr-2"></Badge>
              <span className="text-sm">Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
