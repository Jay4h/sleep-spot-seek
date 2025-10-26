import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Grid, Image, Text, Progress, IconButton, VStack } from '@chakra-ui/react';
import { X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface PhotosUploaderProps {
  maxFiles?: number;
  onFilesChange: (files: File[]) => void;
  existingImages?: string[];
}

export default function PhotosUploader({ maxFiles = 12, onFilesChange, existingImages = [] }: PhotosUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
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

    toast.success(`${acceptedFiles.length} image(s) added`);
  }, [files, maxFiles, onFilesChange]);

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
    <VStack spacing={4} align="stretch">
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? 'primary.500' : 'gray.300'}
        borderRadius="lg"
        p={8}
        textAlign="center"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ borderColor: 'primary.500', bg: 'gray.50' }}
      >
        <input {...getInputProps()} />
        <Upload size={48} style={{ margin: '0 auto', color: '#7c3aed' }} />
        <Text mt={4} fontWeight="medium">
          {isDragActive ? 'Drop images here' : 'Drag & drop images or click to browse'}
        </Text>
        <Text fontSize="sm" color="gray.500" mt={2}>
          Maximum {maxFiles} images, up to 5MB each
        </Text>
      </Box>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box>
          <Text fontSize="sm" mb={2}>Uploading...</Text>
          <Progress value={uploadProgress} size="sm" colorScheme="primary" />
        </Box>
      )}

      {previews.length > 0 && (
        <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
          {previews.map((preview, index) => (
            <Box key={index} position="relative" borderRadius="md" overflow="hidden">
              <Image src={preview} alt={`Preview ${index + 1}`} w="full" h="150px" objectFit="cover" />
              <IconButton
                aria-label="Remove image"
                icon={<X size={16} />}
                size="sm"
                colorScheme="red"
                position="absolute"
                top={2}
                right={2}
                onClick={() => removeFile(index)}
              />
            </Box>
          ))}
        </Grid>
      )}

      <Text fontSize="sm" color="gray.600">
        {files.length} / {maxFiles} images added
      </Text>
    </VStack>
  );
}
