import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className = '' }: SearchBarProps) => {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      navigate(`/search?city=${encodeURIComponent(location)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter city, locality, or property name..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-10 h-12"
        />
      </div>
      <Button type="submit" size="lg" className="px-8">
        <Search className="h-5 w-5 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
