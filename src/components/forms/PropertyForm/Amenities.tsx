import { useState } from 'react';
import { Box, Checkbox, SimpleGrid, Input, Button, Tag, TagLabel, TagCloseButton, HStack, VStack, Text } from '@chakra-ui/react';
import { Plus } from 'lucide-react';

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
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>Common Amenities</Text>
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
          {COMMON_AMENITIES.map(amenity => (
            <Checkbox
              key={amenity}
              isChecked={selectedAmenities.includes(amenity)}
              onChange={() => toggleAmenity(amenity)}
            >
              {amenity}
            </Checkbox>
          ))}
        </SimpleGrid>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>Add Custom Amenity</Text>
        <HStack>
          <Input
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            placeholder="Enter custom amenity"
            onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()}
          />
          <Button leftIcon={<Plus size={16} />} onClick={addCustomAmenity} colorScheme="primary">
            Add
          </Button>
        </HStack>
      </Box>

      {customAmenities.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Custom Amenities</Text>
          <HStack spacing={2} flexWrap="wrap">
            {customAmenities.map(amenity => (
              <Tag key={amenity} size="md" colorScheme="purple" borderRadius="full">
                <TagLabel>{amenity}</TagLabel>
                <TagCloseButton onClick={() => removeCustomAmenity(amenity)} />
              </Tag>
            ))}
          </HStack>
        </Box>
      )}

      <Text fontSize="sm" color="gray.600">
        {selectedAmenities.length} amenities selected
      </Text>
    </VStack>
  );
}
