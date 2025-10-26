import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { Box, Input, FormControl, FormLabel, Text, VStack } from '@chakra-ui/react';
import toast from 'react-hot-toast';

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

        toast.success('Location updated');
      }
    }
  };

  if (!apiKey) {
    return (
      <Box p={8} textAlign="center" bg="red.50" borderRadius="md">
        <Text color="red.600">Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <FormControl>
          <FormLabel>Search Location</FormLabel>
          <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
            <Input
              type="text"
              placeholder="Search for a place..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Autocomplete>
        </FormControl>

        <Box borderRadius="md" overflow="hidden" border="1px" borderColor="gray.200">
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
        </Box>
      </LoadScript>

      <Text fontSize="sm" color="gray.600">
        Click on the map or search for a location to set your property's coordinates
      </Text>

      {marker && (
        <Text fontSize="sm" color="gray.600">
          Selected: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
        </Text>
      )}
    </VStack>
  );
}
