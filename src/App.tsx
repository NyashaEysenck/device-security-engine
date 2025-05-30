import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NetworkAlertProvider } from "@/contexts/NetworkAlertContext";
import { NetworkAlertBanner } from "@/components/ui/NetworkAlertBanner";
import Layout from "@/components/layout/Layout";

import DashboardPage from "@/pages/DashboardPage";
import NetworkMonitorPage from "@/pages/NetworkMonitorPage";
import DevicesPage from "@/pages/ArduinoConnection";
import SecurityMLPage from "@/pages/SecurityMLPage";
import AdminPage from "@/pages/AdminPage";
import SecurityReportsPage from "@/pages/SecurityReportsPage";
import NotFound from "@/pages/NotFound";
import AuditTrailPage from "./pages/AuditTrailPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <NetworkAlertProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NetworkAlertBanner />
            <Routes>
              <Route 
                path="/" 
                element={
                  <Layout>
                    <DashboardPage />
                  </Layout>
                } 
              />
              <Route 
                path="/network" 
                element={
                  <Layout>
                    <NetworkMonitorPage />
                  </Layout>
                } 
              />
              <Route 
                path="/devices" 
                element={
                  <Layout>
                    <DevicesPage />
                  </Layout>
                } 
              />
              <Route 
                path="/security-ml" 
                element={
                  <Layout>
                    <SecurityMLPage />
                  </Layout>
                } 
              />
               <Route 
                path="/audit-trail" 
                element={
                  <Layout>
                    <AuditTrailPage />
                  </Layout>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <Layout>
                    <AdminPage />
                  </Layout>
                } 
              />
              <Route 
                path="/security-reports" 
                element={
                  <Layout>
                    <SecurityReportsPage />
                  </Layout>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NetworkAlertProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
