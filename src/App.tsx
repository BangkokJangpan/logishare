
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import DriverPage from "./pages/DriverPage";
import ShipperPage from "./pages/ShipperPage";
import AdminPage from "./pages/AdminPage";
import TrackingPage from "./pages/TrackingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <div className="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/driver" element={<DriverPage />} />
              <Route path="/shipper" element={<ShipperPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </div>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
