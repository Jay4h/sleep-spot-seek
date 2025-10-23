import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingDetails = location.state?.booking || {
    propertyName: 'Sample Property',
    roomType: 'Private Room',
    price: 8000
  };

  useEffect(() => {
    // Confetti or celebration animation could be added here
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="container max-w-md">
        <Card className="border-none shadow-strong animate-scale-in">
          <CardContent className="pt-12 pb-8 text-center">
            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-primary rounded-full p-6 shadow-strong">
                  <CheckCircle2 className="h-20 w-20 text-primary-foreground animate-scale-in" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
              Congratulation!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Your Order is Successfully Completed
            </p>

            {/* Booking Details */}
            <div className="bg-muted/50 rounded-2xl p-6 mb-8 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Property</span>
                <span className="font-semibold">{bookingDetails.propertyName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-semibold">{bookingDetails.roomType}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-semibold">Amount Paid</span>
                <span className="font-bold text-primary text-xl">₹{bookingDetails.price}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full h-12 text-base font-semibold rounded-xl"
              >
                View Booking
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full h-12 text-base font-semibold rounded-xl"
              >
                Back to Home
              </Button>
            </div>

            {/* Additional Info */}
            <p className="text-sm text-muted-foreground mt-6">
              A confirmation email has been sent to your registered email address
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
