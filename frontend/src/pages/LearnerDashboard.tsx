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
import { useNavigate } from 'react-router-dom';

type Badge = {
  _id: string;
  name: string;
  description?: string;
  earnedAt?: string;
};

type EnrolledCourse = {
  name: string;
  progress: number;
  instructor: string;
  nextLesson: string;
};

type Course = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
};

const LearnerDashboard = () => {
  const navigate = useNavigate();
  // Remove hardcoded stats, compute enrolled courses dynamically
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
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

  // Remove dummy badges, fetch from API
  const [badges, setBadges] = useState<Badge[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(true);
  const [badgesError, setBadgesError] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      setBadgesLoading(true);
      setBadgesError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/users/badges', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch badges');
        const data = await res.json();
        setBadges(data);
      } catch (err) {
        setBadgesError((err as Error).message);
      } finally {
        setBadgesLoading(false);
      }
    };
    fetchBadges();
  }, []);

  // Recommendation logic
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [recommendLoading, setRecommendLoading] = useState(true);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setRecommendLoading(true);
      setRecommendError(null);
      // Only call if not already in sessionStorage
      const cached = sessionStorage.getItem('recommendedCourseIds');
      if (cached) {
        setRecommendedIds(JSON.parse(cached));
        setRecommendLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        // Call backend endpoint for recommendations
        const recRes = await fetch('http://localhost:5000/api/users/recommendations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!recRes.ok) throw new Error('Failed to fetch recommendations');
        const recIds = await recRes.json();
        setRecommendedIds(recIds);
        sessionStorage.setItem('recommendedCourseIds', JSON.stringify(recIds));
      } catch (err) {
        setRecommendError((err as Error).message);
      } finally {
        setRecommendLoading(false);
      }
    };
    // Only run if enrolledCourses is loaded
    if (!loading && enrolledCourses.length > 0) {
      fetchRecommendations();
    }
  }, [loading, enrolledCourses]);

  // Store catalog for recommendation display
  const [catalog, setCatalog] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/courses/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch catalog');
        const data: Course[] = await res.json();
        setCatalog(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchCatalog();
  }, []);

  // Calculate completed courses (progress === 100)
  const completedCourses = enrolledCourses.filter((c: EnrolledCourse) => c.progress === 100).length;

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrolledCourses.length,
      description: "Active enrollments",
      icon: BookOpen,
      trend: { value: 0, isPositive: true } // TODO: Compute trend if needed
    },
    {
      title: "Badges Earned",
      value: badges.length,
      description: "Achievements unlocked",
      icon: Award,
      trend: { value: 0, isPositive: true } // TODO: Compute trend if needed
    },
    {
      title: "Total Courses Enrolled",
      value: enrolledCourses.length,
      description: "All enrollments",
      icon: BookOpen,
      trend: { value: 0, isPositive: true } // TODO: Compute trend if needed
    },
    {
      title: "Courses Completed",
      value: `${completedCourses} / ${enrolledCourses.length}`,
      description: "Courses completed out of enrolled",
      icon: TrendingUp,
      trend: { value: 0, isPositive: true }
    }
  ];

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
            {/* <Button variant="outline" size="sm">
              <Award className="w-4 h-4 mr-2" />
              My Achievements
            </Button> */}
            <Button variant="outline" size="sm" onClick={() => navigate('/learner/browse')}>
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
                {!loading && !error && enrolledCourses.length === 0 && (
                  <div>
                    No enrolled courses found.
                    <Button variant="outline" size="sm" className="ml-2" onClick={() => navigate('/learner/browse')}>
                      Browse Courses
                    </Button>
                  </div>
                )}
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
              {recommendLoading && <div>Loading recommendations...</div>}
              {recommendError && <div style={{ color: 'red' }}>Error: {recommendError}</div>}
              {(!recommendLoading && !recommendError && recommendedIds.length === 0) && (
                <div>
                  No recommendations found.
                  <Button variant="outline" size="sm" className="ml-2" onClick={() => navigate('/learner/browse')}>
                    Browse Courses
                  </Button>
                </div>
              )}
              {recommendedIds.length > 0 && catalog.length === 0 && (
                <div>Loading course details...</div>
              )}
              {recommendedIds.map((id) => {
                const course = catalog.find(c => c._id === id);
                if (!course) return (
                  <div key={id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <h4 className="font-medium text-sm mb-2">CourseId: {id}</h4>
                  </div>
                );
                return (
                  <div key={id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <h4 className="font-medium text-sm mb-2">{course.title}</h4>
                    <div className="text-xs text-muted-foreground mb-1">{course.description}</div>
                    <div className="text-xs text-muted-foreground">Category: {course.category}</div>
                  </div>
                );
              })}
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
              {badgesLoading && <div>Loading badges...</div>}
              {badgesError && <div style={{ color: 'red' }}>Error: {badgesError}</div>}
              {!badgesLoading && !badgesError && badges.length === 0 && <div>No badges found.</div>}
              {badges.map((badge: Badge) => (
                <div key={badge._id} className="p-3 border rounded-lg min-w-[180px] bg-muted/50 flex-shrink-0">
                  <div className="font-bold text-primary mb-1">{badge.name}</div>
                  <div className="text-xs text-muted-foreground mb-1">{badge.description}</div>
                  <div className="text-xs text-muted-foreground">{badge.earnedAt ? `Earned: ${new Date(badge.earnedAt).toLocaleDateString()}` : ''}</div>
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