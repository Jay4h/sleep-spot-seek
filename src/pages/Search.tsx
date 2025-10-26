import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import PropertyCard from '@/components/common/PropertyCard';
import { Property } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockProperties: Property[] = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  ownerId: '1',
  name: `Property ${i + 1}`,
  description: 'Modern PG with all amenities',
  address: `${i + 1} Main Street`,
  city: ['Bangalore', 'Pune', 'Hyderabad'][i % 3],
  state: ['Karnataka', 'Maharashtra', 'Telangana'][i % 3],
  pincode: '560001',
  images: ['/placeholder.svg'],
  amenities: ['WiFi', 'AC', 'Laundry'],
  rules: [],
  verified: i % 2 === 0,
  rating: 4 + Math.random(),
  reviewCount: Math.floor(Math.random() * 50) + 10,
  createdAt: '2024-01-01',
}));

const Search = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minRent: 0,
    maxRent: 20000,
    roomType: '',
    sortBy: 'newest',
  });

  // Fetch properties from backend
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/api/properties');
      const data = await response.json();
      
      if (data.success) {
        // Transform backend data to match frontend Property interface
        const transformedProperties: Property[] = data.data.properties.map((prop: any) => ({
          id: prop._id,
          ownerId: prop.ownerId,
          name: prop.propertyName,
          description: prop.description,
          address: prop.address.street,
          city: prop.address.city,
          state: prop.address.state,
          pincode: prop.address.zipCode,
          images: prop.images || ['/placeholder.svg'],
          amenities: prop.amenities || [],
          rules: prop.rules || [],
          verified: prop.verificationStatus === 'verified',
          rating: prop.rating || 0,
          reviewCount: prop.reviewCount || 0,
          createdAt: prop.createdAt,
        }));
        setProperties(transformedProperties);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch properties',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch properties',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Apply filters to properties
  useEffect(() => {
    let filtered = [...properties];
    
    if (filters.city) {
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Sort
    if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => 5000 - 6000); // Mock sorting
    } else if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setProperties(filtered);
  }, [filters]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>City</Label>
        <Input
          placeholder="Enter city"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Price Range (₹/month)</Label>
        <div className="pt-2">
          <Slider
            min={0}
            max={20000}
            step={1000}
            value={[filters.minRent, filters.maxRent]}
            onValueChange={([min, max]) => setFilters({ ...filters, minRent: min, maxRent: max })}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>₹{filters.minRent}</span>
            <span>₹{filters.maxRent}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Room Type</Label>
        <Select value={filters.roomType} onValueChange={(value) => setFilters({ ...filters, roomType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="double">Double</SelectItem>
            <SelectItem value="triple">Triple</SelectItem>
            <SelectItem value="dormitory">Dormitory</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        className="w-full" 
        variant="outline"
        onClick={() => setFilters({ city: '', minRent: 0, maxRent: 20000, roomType: '', sortBy: 'newest' })}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Search Properties</h1>
            <p className="text-muted-foreground">
              {properties.length} properties found
              {filters.city && ` in ${filters.city}`}
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden md:flex gap-1 border rounded-md p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 border rounded-lg p-6 bg-card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-strong">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading properties...</span>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {!isLoading && properties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No properties found matching your criteria</p>
                <Button 
                  className="mt-4"
                  onClick={() => setFilters({ city: '', minRent: 0, maxRent: 20000, roomType: '', sortBy: 'newest' })}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
