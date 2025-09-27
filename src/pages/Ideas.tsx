import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Plus, MessageCircle, Tags, ArrowRight, GripVertical, Lightbulb } from "lucide-react";

interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  status: "new" | "reviewed" | "moved";
  comments: number;
  createdAt: string;
}

const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "One-click checkout",
    description: "Streamline the purchase process with a single click checkout option for returning customers",
    tags: ["UX", "Payment", "High Priority"],
    author: "Sarah M.",
    status: "new",
    comments: 3,
    createdAt: "2h ago"
  },
  {
    id: "2", 
    title: "Dark mode support",
    description: "Add dark theme option for better user experience during night time usage",
    tags: ["UI", "Accessibility"],
    author: "Mike C.",
    status: "reviewed",
    comments: 5,
    createdAt: "1d ago"
  },
  {
    id: "3",
    title: "Social login integration",
    description: "Allow users to sign in with Google, Facebook, or Apple accounts",
    tags: ["Auth", "Social", "Medium Priority"],
    author: "Emma D.",
    status: "moved",
    comments: 2,
    createdAt: "3d ago"
  }
];

function SortableIdeaCard({ idea }: { idea: Idea }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: idea.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "status-draft";
      case "reviewed": return "status-progress";
      case "moved": return "status-ready";
      default: return "status-draft";
    }
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className="hover:shadow-md transition-shadow cursor-pointer"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-base">{idea.title}</CardTitle>
          </div>
          <Badge className={`${getStatusColor(idea.status)} border`}>
            {idea.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{idea.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {idea.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>By {idea.author}</span>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{idea.comments} comments</span>
            </div>
          </div>
          <span>{idea.createdAt}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [newIdea, setNewIdea] = useState({
    title: "",
    description: "",
    tags: ""
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      // Handle reordering logic here
      console.log("Reordering ideas");
    }
  };

  const handleCreateIdea = () => {
    const idea: Idea = {
      id: Date.now().toString(),
      title: newIdea.title,
      description: newIdea.description,
      tags: newIdea.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      author: "You",
      status: "new",
      comments: 0,
      createdAt: "now"
    };
    
    setIdeas(prev => [idea, ...prev]);
    setNewIdea({ title: "", description: "", tags: "" });
    setIsCreateDialogOpen(false);
  };

  const filteredIdeas = filter === "all" ? ideas : ideas.filter(idea => idea.status === filter);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ideas & Requirements</h1>
            <p className="text-muted-foreground">
              Capture and organize requirements from stakeholders
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Idea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Capture New Idea</DialogTitle>
                <DialogDescription>
                  Add a new requirement or feature idea
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="idea-title">Title</Label>
                  <Input
                    id="idea-title"
                    placeholder="e.g., One-click checkout"
                    value={newIdea.title}
                    onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idea-description">Description</Label>
                  <Textarea
                    id="idea-description"
                    placeholder="Describe the idea, its benefits, and any initial thoughts"
                    value={newIdea.description}
                    onChange={(e) => setNewIdea(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idea-tags">Tags (comma-separated)</Label>
                  <Input
                    id="idea-tags"
                    placeholder="e.g., UX, Payment, High Priority"
                    value={newIdea.tags}
                    onChange={(e) => setNewIdea(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateIdea}>
                    Add Idea
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ideas</SelectItem>
              <SelectItem value="new">New Ideas</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="moved">Moved to Stories</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Move to Story Builder
          </Button>
        </div>

        {/* Ideas Grid */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredIdeas.map(idea => idea.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <SortableIdeaCard idea={idea} />
                </motion.div>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {filteredIdeas.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <div className="p-3 mx-auto w-fit rounded-full bg-muted mb-4">
                <Lightbulb className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No ideas yet</h3>
              <p className="text-muted-foreground mb-4">
                Start capturing requirements and feature ideas from your stakeholders.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Add Your First Idea
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}