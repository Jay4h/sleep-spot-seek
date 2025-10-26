import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

const COMMON_AMENITIES = [
  'WiFi',
  'Laundry',
  'Air Conditioning',
  'Food/Meals',
  'Parking',
  'Self-Kitchen',
  'Washing Machine',
  'CCTV',
  'Power Backup',
  'Water Supply 24/7',
  'Refrigerator',
  'TV',
  'Gym',
  'Common Area',
  'Housekeeping',
];

interface AmenitiesProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
}

export default function Amenities({ selectedAmenities, onChange }: AmenitiesProps) {
  const [customAmenity, setCustomAmenity] = useState('');

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      onChange(selectedAmenities.filter(a => a !== amenity));
    } else {
      onChange([...selectedAmenities, amenity]);
    }
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      onChange([...selectedAmenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const removeCustomAmenity = (amenity: string) => {
    onChange(selectedAmenities.filter(a => a !== amenity));
  };

  const customAmenities = selectedAmenities.filter(a => !COMMON_AMENITIES.includes(a));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Common Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {COMMON_AMENITIES.map(amenity => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={amenity} className="cursor-pointer">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Add Custom Amenity</h3>
        <div className="flex gap-2">
          <Input
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            placeholder="Enter custom amenity"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
          />
          <Button type="button" onClick={addCustomAmenity}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {customAmenities.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-2 block">Custom Amenities</Label>
          <div className="flex flex-wrap gap-2">
            {customAmenities.map(amenity => (
              <Badge key={amenity} variant="secondary" className="pr-1">
                {amenity}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => removeCustomAmenity(amenity)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {selectedAmenities.length} amenities selected
      </p>
    </div>
  );
}
