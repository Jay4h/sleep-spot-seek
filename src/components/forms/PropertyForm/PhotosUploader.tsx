import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotosUploaderProps {
  maxFiles?: number;
  onFilesChange: (files: File[]) => void;
  existingImages?: string[];
}

export default function PhotosUploader({ maxFiles = 12, onFilesChange, existingImages = [] }: PhotosUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `Maximum ${maxFiles} images allowed`,
        variant: 'destructive',
      });
      return;
    }

    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    onFilesChange(newFiles);

    // Create previews
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    toast({
      title: 'Success',
      description: `${acceptedFiles.length} image(s) added`,
    });
  }, [files, maxFiles, onFilesChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: maxFiles - files.length,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-accent' : 'border-border hover:border-primary hover:bg-accent/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
        <p className="font-medium">
          {isDragActive ? 'Drop images here' : 'Drag & drop images or click to browse'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Maximum {maxFiles} images, up to 5MB each
        </p>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div>
          <p className="text-sm mb-2">Uploading...</p>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group rounded-md overflow-hidden border">
              <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {files.length} / {maxFiles} images added
      </p>
    </div>
  );
}
