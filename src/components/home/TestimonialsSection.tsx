
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jessica Smith",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop",
    rating: 5,
    testimonial: "MedicHub Connect made finding a specialist so easy. I was able to book an appointment with a top-rated cardiologist within minutes. The video consultation was seamless!"
  },
  {
    id: 2,
    name: "Mark Thompson",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop",
    rating: 5,
    testimonial: "As a busy professional, I appreciate how quick and convenient the booking process is. The doctor I found was excellent and the follow-up care has been exceptional."
  },
  {
    id: 3,
    name: "Amanda Rodriguez",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=100&h=100&auto=format&fit=crop",
    rating: 4,
    testimonial: "My family has been using MedicHub Connect for over a year now. We love having our medical history in one place and the ability to connect with our doctors easily."
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Patients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of patients nationwide
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
