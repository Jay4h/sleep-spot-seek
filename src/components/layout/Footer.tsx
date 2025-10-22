import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BOOK MY SLEEP</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Find your perfect PG accommodation with ease and comfort.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">
                  Search Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="font-semibold mb-4">For Owners</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/list-property" className="text-muted-foreground hover:text-primary transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/owner-guide" className="text-muted-foreground hover:text-primary transition-colors">
                  Owner Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@bookmysleep.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 1800-123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Book My Sleep. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
