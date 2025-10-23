import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import ProfileCard from '@/components/common/ProfileCard';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      // Mock update - replace with actual API call
      updateUser(data);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Animated Profile Card */}
          <div className="lg:col-span-1 flex justify-center">
            <ProfileCard
              name={user.name}
              title={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              handle={user.email.split('@')[0]}
              status="Online"
              contactText="Message"
              avatarUrl={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => {
                toast({
                  title: 'Contact Feature',
                  description: 'Messaging feature coming soon!',
                });
              }}
            />
          </div>

          {/* Profile Details */}
          <Card className="lg:col-span-2 shadow-medium border-border/50">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Personal Information</CardTitle>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-xl">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 rounded-xl h-11">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {!isEditing && (
                  <Button
                    variant="secondary"
                    className="w-full rounded-xl h-11"
                    onClick={() => navigate('/dashboard')}
                  >
                    Back to Dashboard
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
