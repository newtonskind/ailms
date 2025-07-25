import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter,
  Star,
  Clock,
  Users,
  BookOpen,
  Play
} from "lucide-react";

const CourseBrowse = () => {
  const categories = [
    { name: "All Courses", count: 156, active: true },
    { name: "Programming", count: 67, active: false },
    { name: "Design", count: 34, active: false },
    { name: "Business", count: 28, active: false },
    { name: "Marketing", count: 27, active: false },
  ];

  const courses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      instructor: "Dr. Sarah Wilson",
      description: "Learn the basics of JavaScript programming including variables, functions, and DOM manipulation.",
      level: "Beginner",
      duration: "8 weeks",
      students: 1234,
      rating: 4.8,
      price: "Free",
      image: "/api/placeholder/300/200",
      category: "Programming",
      enrolled: false
    },
    {
      id: 2,
      title: "React Development",
      instructor: "Mike Johnson",
      description: "Master React.js and build modern web applications with components, hooks, and state management.",
      level: "Intermediate",
      duration: "10 weeks",
      students: 856,
      rating: 4.7,
      price: "Free",
      image: "/api/placeholder/300/200",
      category: "Programming",
      enrolled: true
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      instructor: "Emma Davis",
      description: "Learn design thinking, user research, wireframing, and prototyping for digital products.",
      level: "Beginner",
      duration: "6 weeks",
      students: 542,
      rating: 4.9,
      price: "Free",
      image: "/api/placeholder/300/200",
      category: "Design",
      enrolled: false
    },
    {
      id: 4,
      title: "Python for Data Science",
      instructor: "Alice Brown",
      description: "Introduction to Python programming with focus on data analysis and visualization.",
      level: "Beginner",
      duration: "12 weeks",
      students: 698,
      rating: 4.6,
      price: "Free",
      image: "/api/placeholder/300/200",
      category: "Programming",
      enrolled: false
    },
    {
      id: 5,
      title: "Digital Marketing Strategy",
      instructor: "John Smith",
      description: "Comprehensive guide to digital marketing including SEO, social media, and content marketing.",
      level: "Intermediate",
      duration: "8 weeks",
      students: 423,
      rating: 4.5,
      price: "Free",
      image: "/api/placeholder/300/200",
      category: "Marketing",
      enrolled: false
    },
    {
      id: 6,
      title: "Node.js Backend Development",
      instructor: "Dr. Sarah Wilson",
      description: "Build scalable server-side applications with Node.js, Express, and databases.",
      level: "Advanced",
      duration: "14 weeks",
      students: 234,
      rating: 4.8,
      price: "Free",
      image: "/api/placeholder/300/200",
      category: "Programming",
      enrolled: false
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "default";
      case "Intermediate": return "secondary";
      case "Advanced": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <AppLayout userRole="learner">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Browse Courses</h1>
            <p className="text-muted-foreground">Discover new skills and advance your career</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search for courses, skills, or instructors..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={category.active ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                    {course.enrolled && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Enrolled
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-primary">{course.price}</span>
                    <Button size="sm" className="flex items-center gap-2">
                      {course.enrolled ? (
                        <>
                          <Play className="w-4 h-4" />
                          Continue
                        </>
                      ) : (
                        "Enroll Now"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Courses
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseBrowse;