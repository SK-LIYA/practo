
import { SearchBar } from "./SearchBar";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-secondary to-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
            Your Health, Our Priority
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Find and book appointments with quality doctors near you. Instant confirmation, online consultations available.
          </p>
          
          <SearchBar />
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
              50,000+ Verified Doctors
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
              10M+ Happy Patients
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
              4.8/5 Average Rating
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
