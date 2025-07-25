import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  BookOpen,
  Clock,
  Award
} from "lucide-react";

const Analytics = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      description: "Platform users",
      icon: Users,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Course Completions",
      value: 2341,
      description: "This month",
      icon: BookOpen,
      trend: { value: 23, isPositive: true }
    },
    {
      title: "Learning Hours",
      value: "18,542",
      description: "Total study time",
      icon: Clock,
      trend: { value: 18, isPositive: true }
    },
    {
      title: "Certificates Issued",
      value: 892,
      description: "This month",
      icon: Award,
      trend: { value: 15, isPositive: true }
    }
  ];

  const topCourses = [
    { name: "JavaScript Fundamentals", completions: 156, rating: 4.8 },
    { name: "React Development", completions: 134, rating: 4.7 },
    { name: "Python Basics", completions: 98, rating: 4.9 },
    { name: "UI/UX Design", completions: 87, rating: 4.6 },
    { name: "Node.js Backend", completions: 76, rating: 4.5 },
  ];

  const learningTrends = [
    { month: "Jan", users: 890, completions: 245 },
    { month: "Feb", users: 920, completions: 267 },
    { month: "Mar", users: 980, completions: 298 },
    { month: "Apr", users: 1050, completions: 334 },
    { month: "May", users: 1120, completions: 389 },
    { month: "Jun", users: 1248, completions: 456 },
  ];

  return (
    <AppLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Overview</h1>
            <p className="text-muted-foreground">Platform performance and learning insights</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Performing Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{course.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {course.completions} completions
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Rating: {course.rating}/5</span>
                    <span>{Math.round((course.completions / 200) * 100)}%</span>
                  </div>
                  <Progress value={(course.completions / 200) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Learning Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Learning Trends (6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{trend.month}</span>
                      <div className="text-sm text-muted-foreground">
                        {trend.users} users
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{trend.completions}</div>
                      <div className="text-xs text-muted-foreground">completions</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Active Users</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weekly Active Users</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Active Users</span>
                  <span>98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Programming</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Design</span>
                  <span>28%</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Business</span>
                  <span>27%</span>
                </div>
                <Progress value={27} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Beginner Courses</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Intermediate</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Advanced</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;