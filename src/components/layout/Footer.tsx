
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-primary">MedicHub Connect</span>
            </div>
            <p className="text-gray-600 mb-4">
              Your trusted partner for healthcare services and information.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Patients</h3>
            <ul className="space-y-2">
              <li><Link to="/find-doctors" className="text-gray-600 hover:text-primary">Search for Doctors</Link></li>
              <li><Link to="/specialties" className="text-gray-600 hover:text-primary">Medical Specialties</Link></li>
              <li><Link to="/hospitals" className="text-gray-600 hover:text-primary">Hospitals</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary">Health Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Doctors</h3>
            <ul className="space-y-2">
              <li><Link to="/doctor-signup" className="text-gray-600 hover:text-primary">Join MedicHub</Link></li>
              <li><Link to="/doctor-login" className="text-gray-600 hover:text-primary">Doctor Login</Link></li>
              <li><Link to="/practice-management" className="text-gray-600 hover:text-primary">Practice Management</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MedicHub Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
