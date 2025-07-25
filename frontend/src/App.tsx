import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthSelection from "./pages/AuthSelection";
import AdminDashboard from "./pages/AdminDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import LearnerDashboard from "./pages/LearnerDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import Analytics from "./pages/admin/Analytics";
import CourseBrowse from "./pages/learner/CourseBrowse";
import MyCourses from "./pages/instructor/MyCourses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthSelection />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/badges" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          
          {/* Instructor Routes */}
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/instructor/courses" element={<MyCourses />} />
          <Route path="/instructor/create" element={<InstructorDashboard />} />
          <Route path="/instructor/students" element={<InstructorDashboard />} />
          <Route path="/instructor/analytics" element={<InstructorDashboard />} />
          <Route path="/instructor/schedule" element={<InstructorDashboard />} />
          
          {/* Learner Routes */}
          <Route path="/learner" element={<LearnerDashboard />} />
          <Route path="/learner/browse" element={<CourseBrowse />} />
          <Route path="/learner/courses" element={<LearnerDashboard />} />
          <Route path="/learner/progress" element={<LearnerDashboard />} />
          <Route path="/learner/achievements" element={<LearnerDashboard />} />
          <Route path="/learner/profile" element={<LearnerDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
