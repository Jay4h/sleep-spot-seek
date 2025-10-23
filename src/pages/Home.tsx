import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Star, MapPin, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SearchBar from '@/components/common/SearchBar';
import PropertyCard from '@/components/common/PropertyCard';
import { Property } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
  { name: 'Bangalore', properties: '500+', icon: '🏙️' },
  { name: 'Pune', properties: '350+', icon: '🌆' },
  { name: 'Hyderabad', properties: '400+', icon: '🏛️' },
  { name: 'Delhi', properties: '600+', icon: '🕌' },
  { name: 'Mumbai', properties: '550+', icon: '🌃' },
  { name: 'Chennai', properties: '300+', icon: '🏖️' },
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
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJhMiAyIDAgMCAxIDIgMnYyYTIgMiAwIDAgMS0yIDJoLTJ2MmEyIDIgMCAwIDEtMiAyaC0yYTIgMiAwIDAgMS0yLTJ2LTJoLTJhMiAyIDAgMCAxLTItMnYtMmEyIDIgMCAwIDEgMi0yaDJ2LTJhMiAyIDAgMCAxIDItMmgyYTIgMiAwIDAgMSAyIDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="mb-8 animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Welcome to Book My Sleep
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Find Your Perfect PG Accommodation
            </h1>
            <p className="text-xl mb-10 text-white/90 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Discover comfortable and affordable paying guest accommodations in your city
            </p>
            <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                Featured Properties
              </h2>
              <p className="text-muted-foreground text-lg">Hand-picked properties for you</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/search')} className="rounded-xl">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-20 bg-gradient-to-br from-accent/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Popular Cities</h2>
            <p className="text-muted-foreground text-lg">Find PG accommodations in top cities</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularCities.map((city, index) => (
              <button
                key={index}
                onClick={() => navigate(`/search?city=${city.name}`)}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-strong transition-all text-center group hover:-translate-y-2 duration-300"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{city.icon}</div>
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors text-lg">{city.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{city.properties} PGs</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
