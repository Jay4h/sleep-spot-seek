import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicLayout from "@/components/layout/PublicLayout";
import OwnerLayout from "@/components/layout/OwnerLayout";
import SeekerLayout from "@/components/layout/SeekerLayout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PGOwnerRegister from "./pages/auth/PGOwnerRegister";
import Dashboard from "./pages/Dashboard";
import PropertyDetails from "./pages/PropertyDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Overview from "./pages/dashboard/owner/Overview";
import Revenue from "./pages/dashboard/owner/Revenue";
import Messages from "./pages/dashboard/owner/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            } />
            <Route path="/search" element={
              <PublicLayout>
                <Search />
              </PublicLayout>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/pg-owner" element={<PGOwnerRegister />} />
            <Route path="/property/:id" element={
              <PublicLayout>
                <PropertyDetails />
              </PublicLayout>
            } />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={
              <PublicLayout>
                <Dashboard />
              </PublicLayout>
            } />
            
            {/* Owner dashboard routes */}
            <Route path="/dashboard/owner" element={<OwnerLayout />}>
              <Route index element={<Overview />} />
              <Route path="overview" element={<Overview />} />
              <Route path="revenue" element={<Revenue />} />
              <Route path="messages" element={<Messages />} />
            </Route>
            
            {/* Seeker dashboard routes */}
            <Route path="/dashboard/seeker" element={<SeekerLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
            
            {/* Profile route */}
            <Route path="/profile" element={
              <PublicLayout>
                <Profile />
              </PublicLayout>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={
              <PublicLayout>
                <NotFound />
              </PublicLayout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
