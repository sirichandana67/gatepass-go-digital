
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RequestPass from "./pages/RequestPass";
import MyPasses from "./pages/MyPasses";
import VerifyPass from "./pages/VerifyPass";
import ParentLogin from "./pages/ParentLogin";
import FacultyLogin from "./pages/FacultyLogin";
import FacultyDashboard from "./pages/FacultyDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/parent-login" element={<ParentLogin />} />
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/request-pass" element={<RequestPass />} />
          <Route path="/my-passes" element={<MyPasses />} />
          <Route path="/verify" element={<VerifyPass />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
