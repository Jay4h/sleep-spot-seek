import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  IconButton,
  Heading,
  VStack,
  HStack,
  Checkbox,
  Text,
  Divider,
} from '@chakra-ui/react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { RoomFormData } from '@/services/propertyService';
import PhotosUploader from './PhotosUploader';
import toast from 'react-hot-toast';

interface RoomsManagerProps {
  rooms: RoomFormData[];
  onChange: (rooms: RoomFormData[]) => void;
}

const ROOM_AMENITIES = ['AC', 'Attached Bathroom', 'Balcony', 'WiFi', 'TV', 'Wardrobe', 'Study Table'];

export default function RoomsManager({ rooms, onChange }: RoomsManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentRoom, setCurrentRoom] = useState<RoomFormData>({
    roomNumber: '',
    roomType: 'Single',
    price: 0,
    securityDeposit: 0,
    capacity: 1,
    availableFrom: new Date().toISOString().split('T')[0],
    isAvailable: true,
    images: [],
    amenities: [],
  });

  const addRoom = () => {
    if (!currentRoom.roomNumber || currentRoom.price <= 0) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingIndex !== null) {
      const updatedRooms = [...rooms];
      updatedRooms[editingIndex] = currentRoom;
      onChange(updatedRooms);
      toast.success('Room updated');
    } else {
      onChange([...rooms, currentRoom]);
      toast.success('Room added');
    }

    resetForm();
  };

  const deleteRoom = (index: number) => {
    onChange(rooms.filter((_, i) => i !== index));
    toast.success('Room deleted');
  };

  const editRoom = (index: number) => {
    setCurrentRoom(rooms[index]);
    setEditingIndex(index);
  };

  const resetForm = () => {
    setCurrentRoom({
      roomNumber: '',
      roomType: 'Single',
      price: 0,
      securityDeposit: 0,
      capacity: 1,
      availableFrom: new Date().toISOString().split('T')[0],
      isAvailable: true,
      images: [],
      amenities: [],
    });
    setEditingIndex(null);
  };

  const toggleAmenity = (amenity: string) => {
    const amenities = currentRoom.amenities.includes(amenity)
      ? currentRoom.amenities.filter(a => a !== amenity)
      : [...currentRoom.amenities, amenity];
    setCurrentRoom({ ...currentRoom, amenities });
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Room Form */}
      <Card>
        <CardHeader>
          <Heading size="md">{editingIndex !== null ? 'Edit Room' : 'Add Room'}</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel>Room Number</FormLabel>
                <Input
                  value={currentRoom.roomNumber}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, roomNumber: e.target.value })}
                  placeholder="e.g., A101"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Room Type</FormLabel>
                <Select
                  value={currentRoom.roomType}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, roomType: e.target.value as any })}
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Dormitory">Dormitory</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Monthly Rent (₹)</FormLabel>
                <Input
                  type="number"
                  value={currentRoom.price}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, price: Number(e.target.value) })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Security Deposit (₹)</FormLabel>
                <Input
                  type="number"
                  value={currentRoom.securityDeposit}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, securityDeposit: Number(e.target.value) })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Capacity</FormLabel>
                <Input
                  type="number"
                  value={currentRoom.capacity}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: Number(e.target.value) })}
                  min={1}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Available From</FormLabel>
                <Input
                  type="date"
                  value={currentRoom.availableFrom}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, availableFrom: e.target.value })}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <Checkbox
                isChecked={currentRoom.isAvailable}
                onChange={(e) => setCurrentRoom({ ...currentRoom, isAvailable: e.target.checked })}
              >
                Currently Available
              </Checkbox>
            </FormControl>

            <Box w="full">
              <FormLabel>Room Amenities</FormLabel>
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                {ROOM_AMENITIES.map(amenity => (
                  <Checkbox
                    key={amenity}
                    isChecked={currentRoom.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  >
                    {amenity}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </Box>

            <Box w="full">
              <FormLabel>Room Photos</FormLabel>
              <PhotosUploader
                maxFiles={6}
                onFilesChange={(files) => {
                  // In real app, upload files and get URLs
                  console.log('Room images:', files);
                }}
              />
            </Box>

            <HStack w="full" justify="flex-end">
              {editingIndex !== null && (
                <Button variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button leftIcon={<Plus size={16} />} colorScheme="primary" onClick={addRoom}>
                {editingIndex !== null ? 'Update Room' : 'Add Room'}
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <Divider />

      {/* Rooms List */}
      <Box>
        <Heading size="md" mb={4}>Added Rooms ({rooms.length})</Heading>
        {rooms.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={8}>No rooms added yet. Add at least one room to continue.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {rooms.map((room, index) => (
              <Card key={index}>
                <CardBody>
                  <HStack justify="space-between" mb={3}>
                    <Heading size="sm">{room.roomType} Room - {room.roomNumber}</Heading>
                    <HStack>
                      <IconButton
                        aria-label="Edit room"
                        icon={<Edit2 size={16} />}
                        size="sm"
                        onClick={() => editRoom(index)}
                      />
                      <IconButton
                        aria-label="Delete room"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => deleteRoom(index)}
                      />
                    </HStack>
                  </HStack>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm"><strong>Rent:</strong> ₹{room.price}/month</Text>
                    <Text fontSize="sm"><strong>Deposit:</strong> ₹{room.securityDeposit}</Text>
                    <Text fontSize="sm"><strong>Capacity:</strong> {room.capacity} person(s)</Text>
                    <Text fontSize="sm"><strong>Available:</strong> {room.isAvailable ? 'Yes' : 'No'}</Text>
                    {room.amenities.length > 0 && (
                      <Text fontSize="sm"><strong>Amenities:</strong> {room.amenities.join(', ')}</Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </VStack>
  );
}
