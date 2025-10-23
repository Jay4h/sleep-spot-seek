import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SearchBar from '@/components/common/SearchBar';
import PropertyCard from '@/components/common/PropertyCard';
import { Property } from '@/types';

// Mock data - will be replaced with API calls
const featuredProperties: Property[] = [
  {
    id: '1',
    ownerId: '1',
    name: 'Green Valley PG',
    description: 'Modern PG with all amenities',
    address: '123 Main Street',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    images: ['/placeholder.svg'],
    amenities: ['WiFi', 'AC', 'Laundry'],
    rules: [],
    verified: true,
    rating: 4.5,
    reviewCount: 28,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    ownerId: '1',
    name: 'Sunshine Residency',
    description: 'Comfortable living space',
    address: '456 Park Road',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    images: ['/placeholder.svg'],
    amenities: ['WiFi', 'Parking', 'Security'],
    rules: [],
    verified: true,
    rating: 4.7,
    reviewCount: 42,
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    ownerId: '1',
    name: 'Urban Nest PG',
    description: 'Prime location with modern facilities',
    address: '789 Tech Hub',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    images: ['/placeholder.svg'],
    amenities: ['WiFi', 'Gym', 'Food'],
    rules: [],
    verified: true,
    rating: 4.3,
    reviewCount: 35,
    createdAt: '2024-02-01',
  },
];

const popularCities = [
  { name: 'Bangalore', count: '500+ PGs' },
  { name: 'Pune', count: '350+ PGs' },
  { name: 'Hyderabad', count: '400+ PGs' },
  { name: 'Delhi', count: '600+ PGs' },
  { name: 'Mumbai', count: '550+ PGs' },
  { name: 'Chennai', count: '300+ PGs' },
];

const features = [
  {
    icon: Shield,
    title: 'Verified Properties',
    description: 'All properties are thoroughly verified for your safety',
  },
  {
    icon: Clock,
    title: 'Quick Booking',
    description: 'Book your perfect PG in just a few clicks',
  },
  {
    icon: Star,
    title: 'Top Rated',
    description: 'Access reviews and ratings from real tenants',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Find Your Perfect PG
              <br />
              <span className="text-secondary">Book My Sleep</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Discover verified PG accommodations across India. Safe, comfortable, and affordable living spaces await you.
            </p>
            <div className="max-w-3xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-all">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked PGs for you</p>
            </div>
            <Link to="/search">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCities.map((city, index) => (
              <Link key={index} to={`/search?city=${city.name}`}>
                <Card className="hover:shadow-medium transition-all hover:border-primary group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold mb-1">{city.name}</h3>
                    <p className="text-sm text-muted-foreground">{city.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Find Your Perfect PG?
            </h2>
            <p className="text-lg text-white/90">
              Join thousands of happy tenants who found their ideal accommodation through Book My Sleep
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Search Properties
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white hover:bg-white hover:text-primary">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
