import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useNotificationStore } from '@/store/notificationStore';
import {
  Home,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Wallet,
  Users,
  BarChart3,
  Heart,
  CreditCard,
  User,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const ownerLinks = [
  { name: 'Overview', href: '/dashboard/owner', icon: Home },
  { name: 'Properties', href: '/dashboard/owner/properties', icon: Home },
  { name: 'Bookings', href: '/dashboard/owner/bookings', icon: Calendar },
  { name: 'Revenue', href: '/dashboard/owner/revenue', icon: Wallet },
  { name: 'Messages', href: '/dashboard/owner/messages', icon: MessageSquare },
  { name: 'Analytics', href: '/dashboard/owner/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/owner/settings', icon: Settings },
];

const seekerLinks = [
  { name: 'My Bookings', href: '/dashboard/seeker', icon: Calendar },
  { name: 'Search Properties', href: '/search', icon: Home },
  { name: 'Wishlist', href: '/dashboard/seeker/wishlist', icon: Heart },
  { name: 'Payments', href: '/dashboard/seeker/payments', icon: CreditCard },
  { name: 'Messages', href: '/dashboard/seeker/messages', icon: MessageSquare },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/dashboard/seeker/settings', icon: Settings },
];

export default function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { unreadCount: chatUnread } = useChatStore();
  const { unreadCount: notificationUnread } = useNotificationStore();
  const location = useLocation();

  const links = user?.role === 'owner' ? ownerLinks : seekerLinks;

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">BOOK MY SLEEP</h2>
            <p className="text-sm text-muted-foreground">
              {user?.role === 'owner' ? 'Property Owner' : 'PG Seeker'}
            </p>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-2">
              {links.map((link) => {
                const isActive = location.pathname === link.href;
                const Icon = link.icon;
                
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                    {link.name === 'Messages' && chatUnread > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {chatUnread}
                      </span>
                    )}
                    {link.name === 'Overview' && notificationUnread > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {notificationUnread}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <Separator />

          {/* User info and logout */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
