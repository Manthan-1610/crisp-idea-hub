import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Search, Filter, GripVertical, MessageCircle, Link2, Clock } from "lucide-react";

interface UserStory {
  id: string;
  title: string;
  description: string;
  role: string;
  feature: string;
  benefit: string;
  acceptanceCriteria: string;
  status: "draft" | "groomed" | "sprint-ready";
  priority: "low" | "medium" | "high" | "critical";
  storyPoints: string;
  tags: string[];
  dependencies: string[];
  comments: number;
  assignee?: string;
  createdAt: string;
}

const mockStories: UserStory[] = [
  {
    id: "US-001",
    title: "User Registration",
    description: "Allow new users to create accounts",
    role: "User",
    feature: "create an account with email and password",
    benefit: "I can access personalized features",
    acceptanceCriteria: "Given I am on the registration page\nWhen I enter valid details\nThen I should receive a confirmation email",
    status: "sprint-ready",
    priority: "high",
    storyPoints: "5",
    tags: ["Authentication", "Frontend"],
    dependencies: [],
    comments: 2,
    assignee: "John Doe",
    createdAt: "2 days ago"
  },
  {
    id: "US-002", 
    title: "Product Search",
    description: "Enable users to search for products",
    role: "Customer",
    feature: "search for products by name or category",
    benefit: "I can quickly find what I'm looking for",
    acceptanceCriteria: "Given I am on the homepage\nWhen I enter search terms\nThen I should see relevant results",
    status: "groomed",
    priority: "medium", 
    storyPoints: "8",
    tags: ["Search", "Backend", "API"],
    dependencies: ["US-001"],
    comments: 5,
    createdAt: "3 days ago"
  },
  {
    id: "US-003",
    title: "Payment Processing",
    description: "Process customer payments securely",
    role: "Customer",
    feature: "pay for my order using credit card",
    benefit: "I can complete my purchase securely",
    acceptanceCriteria: "Given I have items in cart\nWhen I enter payment details\nThen payment should be processed successfully",
    status: "draft",
    priority: "critical",
    storyPoints: "13",
    tags: ["Payment", "Security", "Backend"],
    dependencies: ["US-001", "US-002"],
    comments: 1,
    createdAt: "1 day ago"
  }
];

const statusColumns = [
  { id: "draft", title: "Draft", color: "status-draft" },
  { id: "groomed", title: "Groomed", color: "status-progress" },
  { id: "sprint-ready", title: "Sprint Ready", color: "status-ready" }
];

function SortableStoryCard({ story }: { story: UserStory }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: story.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "priority-low";
      case "medium": return "priority-medium";
      case "high": return "priority-high";
      case "critical": return "priority-critical";
      default: return "priority-medium";
    }
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className="hover:shadow-md transition-shadow cursor-pointer mb-3"
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{story.id}</CardTitle>
              <h3 className="font-semibold">{story.title}</h3>
            </div>
          </div>
          <Badge className={`${getPriorityColor(story.priority)} border text-xs`}>
            {story.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          As a {story.role}, I want {story.feature} so that {story.benefit}.
        </p>
        
        <div className="flex flex-wrap gap-1">
          {story.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-medium">{story.storyPoints} pts</span>
            {story.dependencies.length > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Link2 className="h-3 w-3" />
                <span>{story.dependencies.length}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              <span>{story.comments}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{story.createdAt}</span>
          </div>
        </div>
        
        {story.assignee && (
          <div className="text-xs text-muted-foreground">
            Assigned to: {story.assignee}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusColumn({ 
  status, 
  title, 
  color, 
  stories 
}: { 
  status: string;
  title: string;
  color: string;
  stories: UserStory[];
}) {
  return (
    <div className="flex-1 min-w-80">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold">{title}</h3>
        <Badge className={`${color} border`}>{stories.length}</Badge>
      </div>
      <SortableContext items={stories.map(story => story.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {stories.map((story) => (
            <SortableStoryCard key={story.id} story={story} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function Backlog() {
  const [stories, setStories] = useState<UserStory[]>(mockStories);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      // Handle status change and reordering logic
      console.log("Moving story:", active.id, "to:", over?.id);
    }
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPriority = priorityFilter === "all" || story.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  const getStoriesByStatus = (status: string) => 
    filteredStories.filter(story => story.status === status);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Backlog Grooming</h1>
            <p className="text-muted-foreground">
              Organize and refine user stories for sprint planning
            </p>
          </div>
          
          <Button className="gap-2">
            Add Story
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {statusColumns.map((column) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StatusColumn
                  status={column.id}
                  title={column.title}
                  color={column.color}
                  stories={getStoriesByStatus(column.id)}
                />
              </motion.div>
            ))}
          </div>
        </DndContext>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{stories.length}</div>
            <div className="text-sm text-muted-foreground">Total Stories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{getStoriesByStatus("sprint-ready").length}</div>
            <div className="text-sm text-muted-foreground">Sprint Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {stories.reduce((sum, story) => sum + parseInt(story.storyPoints || "0"), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round((getStoriesByStatus("sprint-ready").length / stories.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Readiness</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}