
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  consultation_type: string;
  appointment_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  fee: number;
  created_at: string;
  updated_at: string;
}

export function useAppointments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      return data as Appointment[];
    },
    enabled: !!user,
  });

  const createAppointment = useMutation({
    mutationFn: async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'status'>) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ ...appointment, user_id: user!.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment",
      });
    },
  });

  return {
    appointments,
    isLoading,
    createAppointment,
  };
}
