import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  GraduationCap,
  User,
  Award,
  Bell,
  Home,
  Search,
  Calendar,
  FileText
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  userRole: "admin" | "instructor" | "learner";
}

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "User Management", url: "/admin/users", icon: Users },
  { title: "Course Management", url: "/admin/courses", icon: BookOpen },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Badge Management", url: "/admin/badges", icon: Award },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const instructorItems = [
  { title: "Dashboard", url: "/instructor", icon: Home },
  { title: "My Courses", url: "/instructor/courses", icon: BookOpen },
  { title: "Create Course", url: "/instructor/create", icon: FileText },
  { title: "Students", url: "/instructor/students", icon: GraduationCap },
  { title: "Analytics", url: "/instructor/analytics", icon: BarChart3 },
  { title: "Schedule", url: "/instructor/schedule", icon: Calendar },
];

const learnerItems = [
  { title: "Dashboard", url: "/learner", icon: Home },
  { title: "Browse Courses", url: "/learner/browse", icon: Search },
  { title: "My Courses", url: "/learner/courses", icon: BookOpen },
  { title: "My Progress", url: "/learner/progress", icon: BarChart3 },
  { title: "Achievements", url: "/learner/achievements", icon: Award },
  { title: "Profile", url: "/learner/profile", icon: User },
];

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const getItems = () => {
    switch (userRole) {
      case "admin":
        return adminItems;
      case "instructor":
        return instructorItems;
      case "learner":
        return learnerItems;
      default:
        return [];
    }
  };

  const items = getItems();
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      isActive 
        ? "bg-nav-active text-white" 
        : "text-nav-foreground hover:bg-nav-hover hover:text-white"
    }`;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} bg-nav-background border-r-0`}
      collapsible="icon"
    >
      <SidebarContent className="bg-nav-background">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-nav-foreground">LearnHub</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-nav-foreground/70 px-4">
            {userRole === "admin" ? "Administration" : 
             userRole === "instructor" ? "Teaching" : "Learning"}
          </SidebarGroupLabel>

          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}