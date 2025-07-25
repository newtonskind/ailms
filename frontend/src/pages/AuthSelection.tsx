import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  GraduationCap, 
  User, 
  BookOpen,
  Users,
  BarChart3,
  Award,
  Search
} from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

const AuthSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: "admin",
      title: "Administrator",
      description: "Manage the entire platform, users, and courses",
      icon: Shield,
      color: "bg-red-500",
      features: ["User Management", "Course Oversight", "Platform Analytics", "Badge Management"],
      route: "/admin"
    },
    {
      id: "instructor",
      title: "Instructor",
      description: "Create and manage courses, track student progress",
      icon: GraduationCap,
      color: "bg-blue-500",
      features: ["Course Creation", "Student Management", "Progress Tracking", "Content Upload"],
      route: "/instructor"
    },
    {
      id: "learner",
      title: "Learner",
      description: "Access courses, track progress, and earn achievements",
      icon: User,
      color: "bg-green-500",
      features: ["Course Access", "Progress Tracking", "Achievements", "Recommendations"],
      route: "/learner"
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      navigate(role.route);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">LearnHub</h1>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Welcome to Internal Learning Platform
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your role to access the platform. This demo showcases different user experiences
            for administrators, instructors, and learners.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.id}
                className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                  selectedRole === role.id ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <p className="text-muted-foreground">{role.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Features:</h4>
                    <div className="space-y-1">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelect(role.id);
                    }}
                  >
                    Enter as {role.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center p-6">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Course Management</h3>
            <p className="text-sm text-muted-foreground">Create, manage, and deliver engaging courses</p>
          </Card>
          <Card className="text-center p-6">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">User Management</h3>
            <p className="text-sm text-muted-foreground">Role-based access and user administration</p>
          </Card>
          <Card className="text-center p-6">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-muted-foreground">Track progress and performance metrics</p>
          </Card>
          <Card className="text-center p-6">
            <Award className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Gamification</h3>
            <p className="text-sm text-muted-foreground">Badges, achievements, and leaderboards</p>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <Badge variant="outline" className="text-xs">
            Demo Mode - No authentication required
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AuthSelection;