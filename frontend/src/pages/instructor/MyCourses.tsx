import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Plus,
  Edit,
  Eye,
  Users,
  BarChart3,
  Clock
} from "lucide-react";

const MyCourses = () => {
  const courses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      status: "Published",
      students: 89,
      completion: 92,
      lessons: 24,
      duration: "8 weeks",
      lastUpdated: "2 days ago",
      revenue: "$2,340"
    },
    {
      id: 2,
      title: "React Development",
      status: "Published",
      students: 67,
      completion: 78,
      lessons: 32,
      duration: "10 weeks",
      lastUpdated: "1 week ago",
      revenue: "$1,890"
    },
    {
      id: 3,
      title: "Advanced TypeScript",
      status: "Draft",
      students: 0,
      completion: 0,
      lessons: 8,
      duration: "6 weeks",
      lastUpdated: "3 days ago",
      revenue: "$0"
    },
    {
      id: 4,
      title: "Node.js Backend",
      status: "Published",
      students: 54,
      completion: 67,
      lessons: 28,
      duration: "12 weeks",
      lastUpdated: "5 days ago",
      revenue: "$1,560"
    }
  ];

  const getStatusColor = (status: string) => {
    return status === "Published" ? "default" : "secondary";
  };

  return (
    <AppLayout userRole="instructor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
            <p className="text-muted-foreground">Manage and track your course content</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">324</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-sm text-muted-foreground">Avg Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">156h</p>
                  <p className="text-sm text-muted-foreground">Content Hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.lessons} lessons • {course.duration}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(course.status)}>
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{course.students}</p>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{course.completion}%</p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                </div>

                {/* Progress Bar */}
                {course.status === "Published" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Student Progress</span>
                      <span>{course.completion}%</span>
                    </div>
                    <Progress value={course.completion} className="h-2" />
                  </div>
                )}

                {/* Course Info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Updated {course.lastUpdated}</span>
                  {course.status === "Published" && (
                    <span className="font-medium text-green-600">{course.revenue}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Users className="w-4 h-4 mr-2" />
                    Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="w-6 h-6 mb-2" />
              Create Course
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="w-6 h-6 mb-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="w-6 h-6 mb-2" />
              Manage Students
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MyCourses;