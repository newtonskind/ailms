import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle,
  Plus,
  Eye,
  Calendar,
  BarChart3,
  Search
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: "My Courses",
      value: 8,
      description: "Active courses",
      icon: BookOpen,
      trend: { value: 2, isPositive: true }
    },
    {
      title: "Total Students",
      value: 324,
      description: "Enrolled learners",
      icon: Users,
      trend: { value: 18, isPositive: true }
    },
    {
      title: "Pending Reviews",
      value: 12,
      description: "Awaiting approval",
      icon: Clock,
      trend: { value: -5, isPositive: false }
    },
    {
      title: "Completed Courses",
      value: 89,
      description: "This month",
      icon: CheckCircle,
      trend: { value: 25, isPositive: true }
    }
  ];

  const recentCourses = [
    { name: "Advanced React Patterns", students: 45, completion: 78, status: "active" },
    { name: "JavaScript Fundamentals", students: 89, completion: 92, status: "active" },
    { name: "Node.js Backend", students: 32, completion: 65, status: "draft" },
    { name: "TypeScript Masterclass", students: 67, completion: 88, status: "active" },
  ];

  return (
    <AppLayout userRole="instructor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses and students</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/learner/browse')}>
              <Search className="w-4 h-4 mr-2" />
              Browse Courses
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Course Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{course.name}</h4>
                        <Badge variant={course.status === "active" ? "default" : "secondary"}>
                          {course.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{course.students} students</span>
                      <span>•</span>
                      <span>{course.completion}% completion</span>
                    </div>
                    <Progress value={course.completion} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: "New enrollment", course: "React Patterns", time: "1h ago" },
                { action: "Quiz completed", course: "JS Fundamentals", time: "2h ago" },
                { action: "Assignment submitted", course: "TypeScript", time: "3h ago" },
                { action: "Course completed", course: "Node.js Backend", time: "5h ago" },
              ].map((activity, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.course}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default InstructorDashboard;