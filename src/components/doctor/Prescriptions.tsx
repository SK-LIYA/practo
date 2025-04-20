
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ClipboardList, 
  Download, 
  Plus,
  X,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export interface Prescription {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_id: string;
  medication: string;
  dosage: string;
  instructions: string;
  created_at: string;
  doctor_name?: string;
  patient_name?: string;
}

interface PrescriptionsProps {
  patientId?: string;
  appointmentId?: string;
  isDoctor?: boolean;
}

export function Prescriptions({ patientId, appointmentId, isDoctor = false }: PrescriptionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    instructions: '',
  });

  const fetchPrescriptions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      let query = supabase
        .from('prescriptions')
        .select('*');

      if (isDoctor) {
        query = query.eq('doctor_id', user.id);
        if (patientId) {
          query = query.eq('patient_id', patientId);
        }
      } else {
        query = query.eq('patient_id', user.id);
      }

      if (appointmentId) {
        query = query.eq('appointment_id', appointmentId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast({
        variant: "destructive",
        title: "Error fetching prescriptions",
        description: error instanceof Error ? error.message : "Failed to fetch prescriptions",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [user, patientId, appointmentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !patientId || !appointmentId) return;

    try {
      setIsLoading(true);
      const newPrescription = {
        doctor_id: user.id,
        patient_id: patientId,
        appointment_id: appointmentId,
        ...formData,
      };

      const { error } = await supabase
        .from('prescriptions')
        .insert([newPrescription]);

      if (error) throw error;

      toast({
        title: "Prescription created",
        description: "The prescription has been created successfully.",
      });

      setFormData({
        medication: '',
        dosage: '',
        instructions: '',
      });

      setIsDialogOpen(false);
      fetchPrescriptions();
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        variant: "destructive",
        title: "Error creating prescription",
        description: error instanceof Error ? error.message : "Failed to create prescription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (prescription: Prescription) => {
    const content = `
Prescription
--------------------
Date: ${format(new Date(prescription.created_at), 'MMMM d, yyyy')}

Medication: ${prescription.medication}
Dosage: ${prescription.dosage}
Instructions: ${prescription.instructions}

Prescribed by: Dr. ${prescription.doctor_name || 'Doctor'}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${format(new Date(prescription.created_at), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Prescriptions</CardTitle>
          <CardDescription>
            {isDoctor 
              ? "Prescribe medications to your patients" 
              : "View your prescriptions from doctors"}
          </CardDescription>
        </div>
        
        {isDoctor && patientId && appointmentId && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Prescription</DialogTitle>
                <DialogDescription>
                  Fill in the details for the patient's prescription.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication</Label>
                    <Input
                      id="medication"
                      name="medication"
                      placeholder="Enter medication name"
                      value={formData.medication}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      name="dosage"
                      placeholder="E.g., 500mg twice daily"
                      value={formData.dosage}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      name="instructions"
                      placeholder="Additional instructions for the patient"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Prescription"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      
      <CardContent>
        {isLoading && !prescriptions.length ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ClipboardList className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p>No prescriptions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div 
                key={prescription.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{prescription.medication}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(prescription)}
                    className="h-8"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Dosage:</p>
                    <p>{prescription.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Prescribed:</p>
                    <p>{format(new Date(prescription.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Instructions:</p>
                  <p className="whitespace-pre-line">{prescription.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
