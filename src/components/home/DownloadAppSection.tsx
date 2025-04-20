
import { SmartphoneIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const appFeatures = [
  "Book doctor appointments instantly",
  "Video consultations anytime, anywhere",
  "Medicine reminders and health tracking",
  "24/7 access to medical records",
  "Chat with your doctor for follow-ups"
];

export function DownloadAppSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Get the MedicHub Connect App</h2>
            <p className="text-gray-600 mb-8">
              Access quality healthcare on the go. Download our mobile app for a seamless experience with appointment bookings, video consultations, and more.
            </p>
            
            <ul className="space-y-4 mb-8">
              {appFeatures.map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5"></path><path d="M16 3v4"></path><path d="M8 3v4"></path><path d="M3 11h18"></path><path d="M18 16l2 2l4-4"></path></svg>
                App Store
              </Button>
              <Button className="flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                Google Play
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative w-64 h-[500px] bg-gray-900 rounded-[40px] border-[8px] border-gray-800 shadow-xl overflow-hidden">
              {/* Phone frame */}
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-lg"></div>
              
              {/* Screen content */}
              <div className="h-full bg-primary/10 p-4 overflow-hidden">
                <div className="flex justify-center my-4">
                  <SmartphoneIcon className="h-16 w-16 text-primary" />
                </div>
                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                  <h5 className="font-medium mb-2">Upcoming Appointment</h5>
                  <p className="text-sm text-gray-600">Dr. Emily Johnson</p>
                  <p className="text-sm text-gray-600">Today, 4:30 PM</p>
                  <div className="mt-4 flex gap-2">
                    <div className="bg-primary/10 text-primary text-xs rounded px-2 py-1">Video Call</div>
                    <div className="bg-yellow-100 text-yellow-700 text-xs rounded px-2 py-1">Reminder Set</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Medicine Reminder</h5>
                    <span className="bg-red-100 text-red-700 text-xs rounded px-2 py-1">Now</span>
                  </div>
                  <p className="text-sm text-gray-600">Prescription #12345</p>
                  <p className="text-sm text-gray-600">2 pills with water</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-blue-100 p-2 rounded-full inline-block mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs">Appointments</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-green-100 p-2 rounded-full inline-block mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <span className="text-xs">Records</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
