import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Shield, Coffee, Dumbbell, Utensils, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';

// Mock property data
const mockProperty = {
  id: '1',
  name: 'Green Valley PG',
  description: 'Modern PG accommodation with all amenities in the heart of Bangalore. Perfect for working professionals and students.',
  address: '123 Main Street, Koramangala',
  city: 'Bangalore',
  state: 'Karnataka',
  images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  rating: 4.5,
  reviewCount: 28,
  amenities: [
    { name: 'WiFi', icon: Wifi },
    { name: 'Parking', icon: Car },
    { name: '24/7 Security', icon: Shield },
    { name: 'Common Area', icon: Coffee },
    { name: 'Gym', icon: Dumbbell },
    { name: 'Meals', icon: Utensils },
  ],
  rooms: [
    { id: '1', type: 'Single', rent: 8000, deposit: 16000, available: true },
    { id: '2', type: 'Double', rent: 6000, deposit: 12000, available: true },
    { id: '3', type: 'Triple', rent: 5000, deposit: 10000, available: false },
  ],
  rules: [
    'No smoking inside rooms',
    'Visitors allowed till 9 PM',
    'Maintain cleanliness',
    'No loud music after 10 PM',
  ],
  reviews: [
    {
      id: '1',
      userName: 'Rahul Kumar',
      rating: 5,
      comment: 'Excellent place with great facilities. Highly recommended!',
      createdAt: '2024-02-15',
    },
    {
      id: '2',
      userName: 'Priya Sharma',
      rating: 4,
      comment: 'Good location and clean rooms. Staff is very helpful.',
      createdAt: '2024-02-10',
    },
  ],
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [moveInDate, setMoveInDate] = useState('');

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to book a room',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!selectedRoom || !moveInDate) {
      toast({
        title: 'Missing Information',
        description: 'Please select a room and move-in date',
        variant: 'destructive',
      });
      return;
    }

    const room = mockProperty.rooms.find(r => r.id === selectedRoom);
    navigate('/checkout', {
      state: {
        booking: {
          propertyName: mockProperty.name,
          roomType: room?.type + ' Room',
          price: room?.rent || 0,
          duration: '1 Month'
        }
      }
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockProperty.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockProperty.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
            <img
              src={mockProperty.images[currentImageIndex]}
              alt={mockProperty.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {mockProperty.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{mockProperty.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{mockProperty.address}, {mockProperty.city}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-secondary text-secondary" />
                      <span className="font-semibold">{mockProperty.rating}</span>
                      <span className="text-muted-foreground">({mockProperty.reviewCount} reviews)</span>
                    </div>
                    <Badge>Verified</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">{mockProperty.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockProperty.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <amenity.icon className="h-5 w-5 text-primary" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div>
              <h2 className="text-xl font-semibold mb-4">House Rules</h2>
              <ul className="space-y-2">
                {mockProperty.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {mockProperty.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-secondary text-secondary'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockProperty.rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedRoom === room.id ? 'border-primary bg-accent' : 'hover:border-primary/50'
                    } ${!room.available && 'opacity-50 cursor-not-allowed'}`}
                    onClick={() => room.available && setSelectedRoom(room.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{room.type} Room</span>
                      {!room.available && <Badge variant="secondary">Not Available</Badge>}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Rent:</span>{' '}
                        <span className="font-semibold">₹{room.rent}/month</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Deposit:</span> ₹{room.deposit}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="space-y-2">
                  <Label htmlFor="moveInDate">Move-in Date</Label>
                  <Input
                    id="moveInDate"
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" disabled={!selectedRoom || !moveInDate}>
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Booking</DialogTitle>
                      <DialogDescription>
                        Review your booking details before confirming
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Property</p>
                        <p className="font-semibold">{mockProperty.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Room Type</p>
                        <p className="font-semibold">
                          {mockProperty.rooms.find(r => r.id === selectedRoom)?.type} Room
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Move-in Date</p>
                        <p className="font-semibold">
                          {moveInDate ? new Date(moveInDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Rent</p>
                        <p className="font-semibold">
                          ₹{mockProperty.rooms.find(r => r.id === selectedRoom)?.rent}
                        </p>
                      </div>
                      <Button onClick={handleBooking} className="w-full">
                        Confirm Booking
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full">
                  Contact Owner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
