import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Plus, Target, Calendar, Users, Wand2, GripVertical } from "lucide-react";

interface MVP {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  status: "planning" | "ready-for-sprint" | "requirements-complete";
  stories: UserStory[];
  totalPoints: number;
}

interface UserStory {
  id: string;
  title: string;
  priority: "must-have" | "nice-to-have";
  storyPoints: number;
  status: "todo" | "in-progress" | "done";
}

const mockMVPs: MVP[] = [
  {
    id: "mvp-1",
    name: "Core Authentication",
    description: "Basic user registration, login, and profile management",
    targetDate: "2024-02-15",
    status: "completed",
    stories: [
      { id: "US-001", title: "User Registration", priority: "must-have", storyPoints: 5, status: "done" },
      { id: "US-002", title: "User Login", priority: "must-have", storyPoints: 3, status: "done" },
      { id: "US-003", title: "Password Reset", priority: "nice-to-have", storyPoints: 3, status: "done" },
    ],
    totalPoints: 11
  },
  {
    id: "mvp-2", 
    name: "Product Catalog",
    description: "Product browsing, search, and basic product information",
    targetDate: "2024-03-01",
    status: "in-progress",
    stories: [
      { id: "US-004", title: "Product Listing", priority: "must-have", storyPoints: 8, status: "done" },
      { id: "US-005", title: "Product Search", priority: "must-have", storyPoints: 5, status: "in-progress" },
      { id: "US-006", title: "Product Filters", priority: "nice-to-have", storyPoints: 5, status: "todo" },
      { id: "US-007", title: "Product Details", priority: "must-have", storyPoints: 3, status: "in-progress" },
    ],
    totalPoints: 21
  },
  {
    id: "mvp-3",
    name: "Shopping Cart & Checkout",
    description: "Complete purchase flow from cart to payment",
    targetDate: "2024-03-20",
    status: "planning",
    stories: [
      { id: "US-008", title: "Add to Cart", priority: "must-have", storyPoints: 5, status: "todo" },
      { id: "US-009", title: "Cart Management", priority: "must-have", storyPoints: 8, status: "todo" },
      { id: "US-010", title: "Checkout Process", priority: "must-have", storyPoints: 13, status: "todo" },
      { id: "US-011", title: "Payment Integration", priority: "must-have", storyPoints: 13, status: "todo" },
    ],
    totalPoints: 39
  }
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
    return priority === "must-have" ? "status-ready" : "status-draft";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done": return "status-ready";
      case "in-progress": return "status-progress";
      case "todo": return "status-draft";
      default: return "status-draft";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="font-medium text-sm">{story.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getPriorityColor(story.priority)} border text-xs`}>
            {story.priority}
          </Badge>
          <Badge className={`${getStatusColor(story.status)} border text-xs`}>
            {story.storyPoints} pts
          </Badge>
        </div>
      </div>
    </div>
  );
}

function MVPCard({ mvp }: { mvp: MVP }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "status-ready";
      case "in-progress": return "status-progress";
      case "planning": return "status-draft";
      default: return "status-draft";
    }
  };

  const mustHavePoints = mvp.stories
    .filter(story => story.priority === "must-have")
    .reduce((sum, story) => sum + story.storyPoints, 0);

  const completedPoints = mvp.stories
    .filter(story => story.status === "done")
    .reduce((sum, story) => sum + story.storyPoints, 0);

  const progress = mvp.totalPoints > 0 ? (completedPoints / mvp.totalPoints) * 100 : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {mvp.name}
            </CardTitle>
            <CardDescription className="mt-1">{mvp.description}</CardDescription>
          </div>
          <Badge className={`${getStatusColor(mvp.status)} border`}>
            {getStatusLabel(mvp.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stories List */}
        <DndContext collisionDetection={closestCenter} onDragEnd={() => {}}>
          <SortableContext items={mvp.stories.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {mvp.stories.map((story) => (
                <SortableStoryCard key={story.id} story={story} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{mvp.targetDate}</span>
            </div>
            <span className="text-muted-foreground">
              {mustHavePoints}/{mvp.totalPoints} must-have pts
            </span>
          </div>
          <span className="font-medium">{mvp.stories.length} stories</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MVP() {
  const [mvps, setMvps] = useState<MVP[]>(mockMVPs);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMVP, setNewMVP] = useState({
    name: "",
    description: "",
    targetDate: ""
  });

  const handleCreateMVP = () => {
    const mvp: MVP = {
      id: `mvp-${Date.now()}`,
      name: newMVP.name,
      description: newMVP.description,
      targetDate: newMVP.targetDate,
      status: "planning",
      stories: [],
      totalPoints: 0
    };
    
    setMvps(prev => [...prev, mvp]);
    setNewMVP({ name: "", description: "", targetDate: "" });
    setIsCreateDialogOpen(false);
  };

  const handleAISuggestion = () => {
    // Mock AI MVP suggestion
    console.log("AI suggests optimal MVP groupings based on dependencies and priorities");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MVP & Release Planning</h1>
            <p className="text-muted-foreground">
              Group user stories into MVPs - track requirements readiness before sprint planning
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAISuggestion} className="gap-2">
              <Wand2 className="h-4 w-4" />
              AI Suggest
            </Button>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New MVP
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New MVP</DialogTitle>
                  <DialogDescription>
                    Define a new minimum viable product or release
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mvp-name">MVP Name</Label>
                    <Input
                      id="mvp-name"
                      placeholder="e.g., User Management MVP"
                      value={newMVP.name}
                      onChange={(e) => setNewMVP(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mvp-description">Description</Label>
                    <Textarea
                      id="mvp-description"
                      placeholder="Brief description of the MVP goals and scope"
                      value={newMVP.description}
                      onChange={(e) => setNewMVP(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mvp-date">Target Date</Label>
                    <Input
                      id="mvp-date"
                      type="date"
                      value={newMVP.targetDate}
                      onChange={(e) => setNewMVP(prev => ({ ...prev, targetDate: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateMVP}>
                      Create MVP
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* MVP Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total MVPs</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mvps.length}</div>
              <p className="text-xs text-muted-foreground">
                {mvps.filter(mvp => mvp.status === "requirements-complete").length} requirements complete
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mvps.reduce((sum, mvp) => sum + mvp.stories.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all MVPs
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Story Points</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mvps.reduce((sum, mvp) => sum + mvp.totalPoints, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total effort estimate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Must-Have %</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (mvps.reduce((sum, mvp) => 
                    sum + mvp.stories.filter(s => s.priority === "must-have").length, 0
                  ) / mvps.reduce((sum, mvp) => sum + mvp.stories.length, 0)) * 100
                )}%
              </div>
              <p className="text-xs text-muted-foreground">
                Critical features
              </p>
            </CardContent>
          </Card>
        </div>

        {/* MVPs Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Release Timeline</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {mvps.map((mvp, index) => (
              <motion.div
                key={mvp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <MVPCard mvp={mvp} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}