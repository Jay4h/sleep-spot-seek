import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCard, ArrowLeft, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface PaymentForm {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  saveCard: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');

  const bookingDetails = location.state?.booking || {
    propertyName: 'Sample Property',
    roomType: 'Private Room',
    price: 8000,
    duration: '1 Month'
  };

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentForm>();

  const paymentMethods = [
    { id: 'apple', name: 'Apple Pay', icon: '🍎' },
    { id: 'google', name: 'Google Pay', icon: 'G' },
    { id: 'paypal', name: 'PayPal', icon: '💳' },
    { id: 'card', name: 'Credit Card', icon: '💳' }
  ];

  const onSubmit = async (data: PaymentForm) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment-success', {
        state: {
          booking: bookingDetails,
          payment: data
        }
      });
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Check Out</h1>
        </div>

        {/* Saved Cards Display */}
        <div className="mb-6 flex gap-4 overflow-x-auto pb-4">
          <div className="min-w-[280px] h-[160px] bg-gradient-primary rounded-2xl p-5 flex flex-col justify-between text-white shadow-strong">
            <div className="flex justify-between items-start">
              <CreditCard className="h-8 w-8" />
              <div className="text-xs opacity-80">VISA</div>
            </div>
            <div className="space-y-3">
              <div className="font-mono text-lg tracking-wider">•••• •••• •••• 4242</div>
              <div className="flex justify-between text-xs">
                <span>CARD HOLDER</span>
                <span>EXPIRE DATE</span>
              </div>
            </div>
          </div>
          
          <button className="min-w-[120px] h-[160px] border-2 border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">+</div>
            <span className="text-sm font-medium">New</span>
          </button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <Label className="text-base font-semibold mb-4 block">Add New Card</Label>
                <div className="grid grid-cols-4 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="text-[10px] font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="cardHolder">Card Holder</Label>
                <Input
                  id="cardHolder"
                  placeholder="MD. Naiem Islam"
                  {...register('cardHolder', { required: 'Card holder name is required' })}
                  className="h-12 rounded-xl"
                />
                {errors.cardHolder && (
                  <p className="text-sm text-destructive">{errors.cardHolder.message}</p>
                )}
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="5065 4649 7909 5671"
                  maxLength={19}
                  {...register('cardNumber', {
                    required: 'Card number is required',
                    pattern: {
                      value: /^[\d\s]{16,19}$/,
                      message: 'Invalid card number'
                    }
                  })}
                  onChange={(e) => {
                    e.target.value = formatCardNumber(e.target.value);
                  }}
                  className="h-12 rounded-xl"
                />
                {errors.cardNumber && (
                  <p className="text-sm text-destructive">{errors.cardNumber.message}</p>
                )}
              </div>

              {/* Expiry Date and CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expire Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="13/9/25"
                    {...register('expiryDate', {
                      required: 'Expiry date is required',
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                        message: 'Format: MM/YY'
                      }
                    })}
                    className="h-12 rounded-xl"
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-destructive">{errors.expiryDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    maxLength={3}
                    {...register('cvc', {
                      required: 'CVC is required',
                      pattern: {
                        value: /^[0-9]{3}$/,
                        message: 'Invalid CVC'
                      }
                    })}
                    className="h-12 rounded-xl"
                  />
                  {errors.cvc && (
                    <p className="text-sm text-destructive">{errors.cvc.message}</p>
                  )}
                </div>
              </div>

              {/* Save Card Checkbox */}
              <div className="flex items-center space-x-3 py-2">
                <Checkbox
                  id="saveCard"
                  {...register('saveCard')}
                  className="h-5 w-5 rounded-lg"
                />
                <Label
                  htmlFor="saveCard"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Save Credit Card Information
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full h-14 text-base font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary-hover"
              >
                {isProcessing ? 'Processing...' : 'Pay'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property</span>
                <span className="font-medium">{bookingDetails.propertyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-medium">{bookingDetails.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{bookingDetails.duration}</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-primary">₹{bookingDetails.price}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
