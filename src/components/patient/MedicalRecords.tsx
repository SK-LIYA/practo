
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Trash2, Download } from "lucide-react";
import { format } from "date-fns";

export interface MedicalRecord {
  id: string;
  user_id: string;
  name: string;
  file_path: string;
  uploaded_at: string;
  size: number;
  content_type: string;
}

export function MedicalRecords() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchRecords = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast({
        variant: "destructive",
        title: "Error fetching records",
        description: error instanceof Error ? error.message : "Failed to fetch medical records",
      });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setIsUploading(true);
    try {
      const file = files[0];

      // 1. Upload file to storage
      const filePath = `medical_records/${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('medical_records')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Create record in database
      const newRecord = {
        user_id: user.id,
        name: file.name,
        file_path: filePath,
        size: file.size,
        content_type: file.type,
      };

      const { error: insertError } = await supabase
        .from('medical_records')
        .insert([newRecord]);

      if (insertError) throw insertError;

      toast({
        title: "File uploaded",
        description: "Your medical record has been uploaded successfully.",
      });

      fetchRecords();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (record: MedicalRecord) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      // 1. Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('medical_records')
        .remove([record.file_path]);

      if (storageError) throw storageError;

      // 2. Delete record from database
      const { error: dbError } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', record.id);

      if (dbError) throw dbError;

      toast({
        title: "Record deleted",
        description: "The medical record has been deleted.",
      });

      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete record",
      });
    }
  };

  const handleDownload = async (record: MedicalRecord) => {
    try {
      const { data, error } = await supabase.storage
        .from('medical_records')
        .download(record.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = record.name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download file",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Records</CardTitle>
        <CardDescription>Upload and manage your medical records securely</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: PDF, JPG, PNG, DOCX (Max 10MB)
              </p>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                disabled={isUploading}
              />
            </div>
          </Label>
        </div>

        {isUploading && (
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
            <div className="bg-primary h-2.5 rounded-full w-1/2 animate-pulse"></div>
          </div>
        )}

        {records.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p>No medical records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-primary/70" />
                  <div>
                    <p className="font-medium">{record.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(record.size)} • 
                      {format(new Date(record.uploaded_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDownload(record)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(record)}
                    title="Delete"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
