import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar 
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Lightbulb, 
  FileText, 
  Package, 
  Target, 
  CheckCircle, 
  Download,
  ChevronRight
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Ideas", url: "/ideas", icon: Lightbulb },
  { title: "Story Builder", url: "/story-builder", icon: FileText },
  { title: "Backlog", url: "/backlog", icon: Package },
  { title: "MVP Planning", url: "/mvp", icon: Target },
  { title: "Sprint Readiness", url: "/sprint-readiness", icon: CheckCircle },
  { title: "Exports", url: "/exports", icon: Download },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"}>
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-lg transition-all ${collapsed ? "text-center text-xs" : ""}`}>
            {collapsed ? "AR" : "Agile Requirements"}
          </h2>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`transition-colors ${
                      isActive(item.url) 
                        ? "bg-primary/10 text-primary border-r-2 border-primary" 
                        : "hover:bg-secondary/80"
                    }`}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {isActive(item.url) && <ChevronRight className="h-4 w-4" />}
                        </>
                      )}
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