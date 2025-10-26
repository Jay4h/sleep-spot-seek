import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { RoomFormData } from '@/services/propertyService';
import PhotosUploader from './PhotosUploader';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const addRoom = () => {
    if (!currentRoom.roomNumber || currentRoom.price <= 0) {
      toast({
        title: 'Missing information',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (editingIndex !== null) {
      const updatedRooms = [...rooms];
      updatedRooms[editingIndex] = currentRoom;
      onChange(updatedRooms);
      toast({
        title: 'Room updated',
        description: 'Room details have been updated',
      });
    } else {
      onChange([...rooms, currentRoom]);
      toast({
        title: 'Room added',
        description: 'New room has been added',
      });
    }

    resetForm();
  };

  const deleteRoom = (index: number) => {
    onChange(rooms.filter((_, i) => i !== index));
    toast({
      title: 'Room deleted',
      description: 'Room has been removed',
    });
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
    <div className="space-y-6">
      {/* Room Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingIndex !== null ? 'Edit Room' : 'Add Room'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomNumber">Room Number *</Label>
              <Input
                id="roomNumber"
                value={currentRoom.roomNumber}
                onChange={(e) => setCurrentRoom({ ...currentRoom, roomNumber: e.target.value })}
                placeholder="e.g., A101"
              />
            </div>

            <div>
              <Label htmlFor="roomType">Room Type *</Label>
              <select
                id="roomType"
                value={currentRoom.roomType}
                onChange={(e) => setCurrentRoom({ ...currentRoom, roomType: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Dormitory">Dormitory</option>
              </select>
            </div>

            <div>
              <Label htmlFor="price">Monthly Rent (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={currentRoom.price}
                onChange={(e) => setCurrentRoom({ ...currentRoom, price: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="securityDeposit">Security Deposit (₹) *</Label>
              <Input
                id="securityDeposit"
                type="number"
                value={currentRoom.securityDeposit}
                onChange={(e) => setCurrentRoom({ ...currentRoom, securityDeposit: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                value={currentRoom.capacity}
                onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: Number(e.target.value) })}
                min={1}
              />
            </div>

            <div>
              <Label htmlFor="availableFrom">Available From *</Label>
              <Input
                id="availableFrom"
                type="date"
                value={currentRoom.availableFrom}
                onChange={(e) => setCurrentRoom({ ...currentRoom, availableFrom: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAvailable"
              checked={currentRoom.isAvailable}
              onCheckedChange={(checked) => setCurrentRoom({ ...currentRoom, isAvailable: checked as boolean })}
            />
            <Label htmlFor="isAvailable">Currently Available</Label>
          </div>

          <div>
            <Label>Room Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {ROOM_AMENITIES.map(amenity => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={currentRoom.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Room Photos</Label>
            <PhotosUploader
              maxFiles={6}
              onFilesChange={(files) => {
                console.log('Room images:', files);
              }}
            />
          </div>

          <div className="flex justify-end gap-2">
            {editingIndex !== null && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button type="button" onClick={addRoom}>
              <Plus className="h-4 w-4 mr-2" />
              {editingIndex !== null ? 'Update Room' : 'Add Room'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Rooms List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Added Rooms ({rooms.length})</h3>
        {rooms.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No rooms added yet. Add at least one room to continue.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">
                      {room.roomType} Room - {room.roomNumber}
                    </h4>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => editRoom(index)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteRoom(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Rent:</strong> ₹{room.price}/month</p>
                    <p><strong>Deposit:</strong> ₹{room.securityDeposit}</p>
                    <p><strong>Capacity:</strong> {room.capacity} person(s)</p>
                    <p><strong>Available:</strong> {room.isAvailable ? 'Yes' : 'No'}</p>
                    {room.amenities.length > 0 && (
                      <p><strong>Amenities:</strong> {room.amenities.join(', ')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
