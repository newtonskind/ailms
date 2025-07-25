import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Award,
  TrendingUp,
  UserPlus,
  Plus,
  Settings
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      description: "Active platform users",
      icon: Users,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Total Courses",
      value: 156,
      description: "Published courses",
      icon: BookOpen,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Active Learners",
      value: 892,
      description: "Currently enrolled",
      icon: GraduationCap,
      trend: { value: 15, isPositive: true }
    },
    {
      title: "Badges Earned",
      value: "2,341",
      description: "Total achievements",
      icon: Award,
      trend: { value: 23, isPositive: true }
    }
  ];

  return (
    <AppLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your learning platform</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Platform Settings
            </Button>
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New course published", user: "Dr. Sarah Wilson", time: "2 hours ago" },
                  { action: "User enrolled in Advanced React", user: "John Smith", time: "4 hours ago" },
                  { action: "Badge earned: JavaScript Master", user: "Alice Johnson", time: "6 hours ago" },
                  { action: "Course completed", user: "Mike Brown", time: "8 hours ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Courses
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="w-4 h-4 mr-2" />
                Manage Badges
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;