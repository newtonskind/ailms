import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp,
  Play,
  Search,
  Star,
  CheckCircle
} from "lucide-react";

const LearnerDashboard = () => {
  const stats = [
    {
      title: "Enrolled Courses",
      value: 6,
      description: "Active enrollments",
      icon: BookOpen,
      trend: { value: 2, isPositive: true }
    },
    {
      title: "Badges Earned",
      value: 12,
      description: "Achievements unlocked",
      icon: Award,
      trend: { value: 3, isPositive: true }
    },
    {
      title: "Study Time",
      value: "24h",
      description: "This week",
      icon: Clock,
      trend: { value: 15, isPositive: true }
    },
    {
      title: "Completion Rate",
      value: "87%",
      description: "Overall progress",
      icon: TrendingUp,
      trend: { value: 8, isPositive: true }
    }
  ];

  // Remove hardcoded enrolledCourses, only use fetched data
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/enrollments/my-requests', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch enrollments');
        const data = await res.json();
        const courses = data.map(e => ({
          name: e.courseId?.title || 'Unknown',
          progress: 0, // TODO: Replace with real progress if available
          instructor: e.courseId?.instructorId?.name || 'Unknown',
          nextLesson: '', // TODO: Replace with real next lesson if available
        }));
        setEnrolledCourses(courses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  const recommendedCourses = [
    { name: "Advanced JavaScript", rating: 4.8, students: 2150, duration: "8 weeks" },
    { name: "Node.js Backend", rating: 4.7, students: 1890, duration: "6 weeks" },
    { name: "TypeScript Essentials", rating: 4.9, students: 1654, duration: "4 weeks" },
  ];

  return (
    <AppLayout userRole="learner">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Award className="w-4 h-4 mr-2" />
              My Achievements
            </Button>
            <Button size="sm">
              <Search className="w-4 h-4 mr-2" />
              Browse Courses
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
          {/* Continue Learning */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {loading && <div>Loading enrolled courses...</div>}
                {error && <div style={{ color: 'red' }}>Error: {error}</div>}
                {!loading && !error && enrolledCourses.length === 0 && <div>No enrolled courses found.</div>}
                {enrolledCourses.map((course, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{course.name}</h4>
                        <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                      </div>
                      <Button size="sm">
                        Continue
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Next: {course.nextLesson}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedCourses.map((course, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h4 className="font-medium text-sm mb-2">{course.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{course.duration}</span>
                    <Button size="sm" variant="outline">
                      Enroll
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[
                { name: "JavaScript Master", description: "Completed JS Fundamentals", date: "2 days ago" },
                { name: "Quick Learner", description: "Finished 3 lessons in one day", date: "1 week ago" },
                { name: "Problem Solver", description: "Solved 50 coding challenges", date: "2 weeks ago" },
              ].map((achievement, index) => (
                <div key={index} className="flex-shrink-0 p-4 bg-primary/10 rounded-lg border min-w-64">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground">{achievement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default LearnerDashboard;