import { Link } from 'react-router-dom';
import { MapPin, Star, Users, IndianRupee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link to={`/property/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={property.images[0] || '/placeholder.svg'}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {property.verified && (
            <Badge className="absolute top-3 right-3 bg-primary">
              Verified
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {property.name}
          </h3>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{property.city}, {property.state}</span>
          </div>

          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span className="font-medium">{property.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({property.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">Multiple rooms</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-primary">
              <IndianRupee className="h-4 w-4" />
              <span>From 5,000/mo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
