
import { Search, Calendar, VideoIcon, MessageSquare } from "lucide-react";

const steps = [
  {
    title: "Search Doctor",
    description: "Find doctors by specialty, name, or treatment type",
    icon: Search,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Book Appointment",
    description: "Select your preferred time slot and book instantly",
    icon: Calendar,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Online Consultation",
    description: "Connect with your doctor through secure video calls",
    icon: VideoIcon,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Follow-up Care",
    description: "Message your doctor for follow-up questions",
    icon: MessageSquare,
    color: "bg-orange-100 text-orange-600"
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How MedicHub Connect Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get quality healthcare in a few simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="flex flex-col items-center">
                <div className={`${step.color} p-4 rounded-full mb-6`}>
                  <step.icon className="h-6 w-6" />
                </div>
                
                {/* Line connector (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gray-200 z-0"></div>
                )}
                
                {/* Step number */}
                <div className="bg-primary text-white text-sm rounded-full w-6 h-6 flex items-center justify-center absolute top-0 right-[45%] md:right-[25%]">
                  {index + 1}
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
