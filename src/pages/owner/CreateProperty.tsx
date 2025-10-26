import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { propertyService, PropertyFormData } from '@/services/propertyService';
import { basicInfoSchema } from '@/utils/validators';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import BasicInfo from '@/components/forms/PropertyForm/BasicInfo';
import PhotosUploader from '@/components/forms/PropertyForm/PhotosUploader';
import Amenities from '@/components/forms/PropertyForm/Amenities';
import LocationMap from '@/components/forms/PropertyForm/LocationMap';
import RoomsManager from '@/components/forms/PropertyForm/RoomsManager';
import { RoomFormData } from '@/services/propertyService';

const steps = [
  { title: 'Basic Info', description: 'Property details and address' },
  { title: 'Photos', description: 'Upload property images' },
  { title: 'Amenities', description: 'Select available amenities' },
  { title: 'Location', description: 'Set property location on map' },
  { title: 'Rooms', description: 'Add rooms and pricing' },
  { title: 'Review', description: 'Review and submit' },
];

export default function CreateProperty() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<PropertyFormData>>({
    amenities: [],
    images: [],
    rooms: [],
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(basicInfoSchema),
    mode: 'onChange',
  });

  const createPropertyMutation = useMutation({
    mutationFn: (data: PropertyFormData) => propertyService.createProperty(data),
    onSuccess: (data) => {
      toast({
        title: 'Success!',
        description: 'Property created successfully',
      });
      navigate(`/dashboard/owner/properties/${data._id}`);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create property. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleNext = async () => {
    if (currentStep === 0) {
      const isValid = await trigger();
      if (!isValid) return;
    }

    if (currentStep === 4 && formData.rooms && formData.rooms.length === 0) {
      toast({
        title: 'At least one room required',
        description: 'Please add at least one room before continuing',
        variant: 'destructive',
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = handleSubmit((data: any) => {
    const finalData: PropertyFormData = {
      ...formData,
      propertyName: data.propertyName,
      description: data.description,
      propertyType: data.propertyType,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        coordinates: formData.address?.coordinates || { lat: 0, lng: 0 },
      },
      amenities: formData.amenities || [],
      images: formData.images || [],
      rooms: formData.rooms || [],
    };

    createPropertyMutation.mutate(finalData);
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Register Your PG</CardTitle>
          <CardDescription>Complete all steps to list your property</CardDescription>
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          {/* Step Indicators */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    index < currentStep
                      ? 'bg-primary border-primary text-primary-foreground'
                      : index === currentStep
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <p className="text-xs mt-2 text-center hidden md:block">{step.title}</p>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <form onSubmit={onSubmit}>
            <div className="min-h-[400px]">
              {currentStep === 0 && <BasicInfo register={register} errors={errors} />}

              {currentStep === 1 && (
                <PhotosUploader
                  maxFiles={12}
                  onFilesChange={(files) => console.log('Files:', files)}
                  existingImages={formData.images}
                />
              )}

              {currentStep === 2 && (
                <Amenities
                  selectedAmenities={formData.amenities || []}
                  onChange={(amenities) => setFormData({ ...formData, amenities })}
                />
              )}

              {currentStep === 3 && (
                <LocationMap
                  onLocationChange={(location) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address!,
                        coordinates: { lat: location.lat, lng: location.lng },
                      },
                    })
                  }
                />
              )}

              {currentStep === 4 && (
                <RoomsManager
                  rooms={formData.rooms || []}
                  onChange={(rooms) => setFormData({ ...formData, rooms })}
                />
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Review Your Property</h3>
                  <div className="grid gap-4">
                    <div>
                      <h4 className="font-medium">Basic Info</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.propertyName} - {formData.propertyType}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Amenities</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.amenities?.length || 0} amenities selected
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Photos</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.images?.length || 0} images uploaded
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Rooms</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.rooms?.length || 0} rooms configured
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={createPropertyMutation.isPending}>
                  {createPropertyMutation.isPending ? 'Submitting...' : 'Submit Property'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
