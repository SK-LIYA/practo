
import { Link } from "react-router-dom";
import { Brain, Heart, Stethoscope, Bone, Eye, Smile, UserPlus, Baby } from "lucide-react";

const specialties = [
  { 
    name: "Cardiology", 
    icon: Heart, 
    description: "Heart health specialists",
    count: 524
  },
  { 
    name: "Neurology", 
    icon: Brain, 
    description: "Brain and nervous system",
    count: 385
  },
  { 
    name: "Orthopedics", 
    icon: Bone, 
    description: "Bone and joint specialists",
    count: 412
  },
  { 
    name: "Ophthalmology", 
    icon: Eye, 
    description: "Eye care specialists",
    count: 329
  },
  { 
    name: "Dentistry", 
    icon: Smile, 
    description: "Dental health care",
    count: 648
  },
  { 
    name: "General Medicine", 
    icon: Stethoscope, 
    description: "Primary healthcare",
    count: 832
  },
  { 
    name: "Dermatology", 
    icon: UserPlus, 
    description: "Skin specialists",
    count: 267
  },
  { 
    name: "Pediatrics", 
    icon: Baby, 
    description: "Child healthcare",
    count: 493
  }
];

export function SpecialtiesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Find Doctors by Specialty</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with specialized healthcare professionals across all medical disciplines
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {specialties.map((specialty) => (
            <Link 
              key={specialty.name}
              to={`/specialties/${specialty.name.toLowerCase()}`}
              className="bg-white border border-gray-100 rounded-lg p-6 text-center transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="bg-secondary inline-flex p-3 rounded-full mb-4">
                <specialty.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-1">{specialty.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{specialty.description}</p>
              <p className="text-primary text-sm font-medium">{specialty.count} doctors</p>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/specialties"
            className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
          >
            View all specialties
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
