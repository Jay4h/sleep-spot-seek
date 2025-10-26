import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 28.6139, // Delhi
  lng: 77.2090,
};

interface LocationMapProps {
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address?: string };
}

const libraries: ("places")[] = ['places'];

export default function LocationMap({ onLocationChange, initialLocation }: LocationMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState(initialLocation || defaultCenter);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [address, setAddress] = useState(initialLocation?.address || '');
  const { toast } = useToast();

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });

      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const newAddress = results[0].formatted_address;
          setAddress(newAddress);
          onLocationChange({ lat, lng, address: newAddress });
        }
      });
    }
  }, [onLocationChange]);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newAddress = place.formatted_address || '';
        
        setMarker({ lat, lng });
        setAddress(newAddress);
        onLocationChange({ lat, lng, address: newAddress });

        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }

        toast({
          title: 'Location updated',
          description: 'Property location has been set',
        });
      }
    }
  };

  if (!apiKey) {
    return (
      <div className="p-8 text-center bg-destructive/10 rounded-md">
        <p className="text-destructive">
          Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <div>
          <Label htmlFor="location-search">Search Location</Label>
          <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
            <Input
              id="location-search"
              type="text"
              placeholder="Search for a place..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Autocomplete>
        </div>

        <div className="rounded-md overflow-hidden border">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={marker}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={onMapClick}
          >
            <Marker position={marker} draggable onDragEnd={onMapClick} />
          </GoogleMap>
        </div>
      </LoadScript>

      <p className="text-sm text-muted-foreground">
        Click on the map or search for a location to set your property's coordinates
      </p>

      {marker && (
        <p className="text-sm text-muted-foreground">
          Selected: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
