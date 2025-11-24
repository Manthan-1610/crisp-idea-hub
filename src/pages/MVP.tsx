import { useState, useEffect } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DndContext, DragEndEvent, DragOverlay, closestCorners, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Plus, Target, Calendar, GripVertical, Edit, Trash2, MessageCircle, Search, Filter } from "lucide-react";
import { UserStory, MVP as MVPType } from "@/types";
import { storage } from "@/lib/storage";
import { initializeMockData } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

function StoryCard({ story, showMVP = false }: { story: UserStory; showMVP?: boolean }) {
  const navigate = useNavigate();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready-for-sprint": return "bg-green-100 text-green-800 border-green-200";
      case "groomed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">{story.id}</span>
              <Badge className={`${getStatusColor(story.status)} text-xs`}>
                {story.status}
              </Badge>
            </div>
            <CardTitle className="text-sm font-semibold line-clamp-1">{story.title}</CardTitle>
          </div>
          <Badge className={`${getPriorityColor(story.priority)} text-xs shrink-0`}>
            {story.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground line-clamp-2">
          As a <span className="font-medium">{story.role}</span>, I want {story.feature}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {story.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs pt-2 border-t">
          <div className="flex items-center gap-3">
            <span className="font-medium">{story.storyPoints} pts</span>
            <span className="text-muted-foreground">Value: {story.businessValue}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/story-builder");
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

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

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute left-2 top-4 z-10" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
      </div>
      <div className="pl-6">
        <StoryCard story={story} />
      </div>
    </div>
  );
}

function MVPSection({ mvp, stories, onDelete, onEdit }: { 
  mvp: MVPType; 
  stories: UserStory[];
  onDelete: (id: string) => void;
  onEdit: (mvp: MVPType) => void;
}) {
  const mvpStories = stories.filter(s => mvp.stories.includes(s.id));
  const readyStories = mvpStories.filter(s => s.status === "ready-for-sprint");
  const totalPoints = mvpStories.reduce((sum, s) => sum + s.storyPoints, 0);
  const readyPoints = readyStories.reduce((sum, s) => sum + s.storyPoints, 0);
  const progress = totalPoints > 0 ? (readyPoints / totalPoints) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "requirements-complete": return "bg-green-100 text-green-800 border-green-200";
      case "ready-for-sprint": return "bg-blue-100 text-blue-800 border-blue-200";
      case "planning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>{mvp.name}</CardTitle>
            </div>
            <CardDescription className="mt-1">{mvp.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(mvp.status)}>
              {mvp.status.replace("-", " ")}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => onEdit(mvp)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(mvp.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Requirements Readiness</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{readyPoints} / {totalPoints} points ready</span>
            <span>{readyStories.length} / {mvpStories.length} stories ready</span>
          </div>
        </div>

        {/* Stories */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Assigned Stories ({mvpStories.length})</h4>
          <SortableContext items={mvpStories.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 min-h-[100px] p-2 border-2 border-dashed rounded-lg bg-muted/20">
              {mvpStories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Drag stories here to assign to this MVP
                </p>
              ) : (
                mvpStories.map(story => (
                  <SortableStoryCard key={story.id} story={story} />
                ))
              )}
            </div>
          </SortableContext>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{mvp.targetDate}</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Total: {totalPoints} pts</span>
            <span>Value: {mvpStories.reduce((sum, s) => sum + s.businessValue, 0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MVP() {
  const [mvps, setMvps] = useState<MVPType[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMVP, setEditingMVP] = useState<MVPType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newMVP, setNewMVP] = useState({
    name: "",
    description: "",
    targetDate: ""
  });

  useEffect(() => {
    initializeMockData();
    loadData();
  }, []);

  const loadData = () => {
    setMvps(storage.getMVPs());
    setStories(storage.getStories());
  };

  const handleCreateMVP = () => {
    if (editingMVP) {
      storage.updateMVP(editingMVP.id, {
        name: newMVP.name,
        description: newMVP.description,
        targetDate: newMVP.targetDate,
      });
    } else {
      const mvp: MVPType = {
        id: `mvp-${Date.now()}`,
        name: newMVP.name,
        description: newMVP.description,
        targetDate: newMVP.targetDate,
        status: "planning",
        stories: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storage.addMVP(mvp);
    }
    
    loadData();
    setNewMVP({ name: "", description: "", targetDate: "" });
    setEditingMVP(null);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteMVP = (id: string) => {
    if (confirm("Are you sure you want to delete this MVP? Stories will be unassigned.")) {
      storage.deleteMVP(id);
      loadData();
    }
  };

  const handleEditMVP = (mvp: MVPType) => {
    setEditingMVP(mvp);
    setNewMVP({
      name: mvp.name,
      description: mvp.description,
      targetDate: mvp.targetDate
    });
    setIsCreateDialogOpen(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeStoryId = active.id as string;
    const overId = over.id as string;

    // Find which MVP the story is being dropped into
    const targetMVP = mvps.find(mvp => mvp.id === overId);
    
    if (targetMVP) {
      // Assign story to MVP
      const story = stories.find(s => s.id === activeStoryId);
      if (story && story.status === "groomed") {
        storage.updateStory(activeStoryId, { mvpId: targetMVP.id });
        storage.updateMVP(targetMVP.id, {
          stories: [...targetMVP.stories, activeStoryId]
        });
        loadData();
      }
    } else {
      // Reordering within the available stories or within an MVP
      const activeStory = stories.find(s => s.id === activeStoryId);
      const overStory = stories.find(s => s.id === overId);
      
      if (activeStory && overStory && activeStory.mvpId === overStory.mvpId) {
        // Just reordering, could implement if needed
      }
    }
  };

  const availableStories = stories.filter(s => s.mvpId === null && s.status === "groomed");
  const filteredAvailableStories = availableStories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeStory = activeId ? stories.find(s => s.id === activeId) : null;

  return (
    <AppLayout>
      <DndContext 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">MVP Planning</h1>
              <p className="text-muted-foreground">
                Group groomed stories into MVPs - track requirements readiness before sprint planning
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open);
              if (!open) {
                setEditingMVP(null);
                setNewMVP({ name: "", description: "", targetDate: "" });
              }
            }}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create New MVP
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingMVP ? "Edit MVP" : "Create New MVP"}</DialogTitle>
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
                    <Button onClick={handleCreateMVP} disabled={!newMVP.name || !newMVP.targetDate}>
                      {editingMVP ? "Update MVP" : "Create MVP"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid lg:grid-cols-[1fr_350px] gap-6">
            {/* MVPs Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">MVPs ({mvps.length})</h2>
              
              {mvps.length === 0 ? (
                <Card className="p-12 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No MVPs planned yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create an MVP to start grouping your groomed stories
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First MVP
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {mvps.map((mvp, index) => (
                    <motion.div
                      key={mvp.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <SortableContext items={[mvp.id]} strategy={verticalListSortingStrategy}>
                        <div id={mvp.id}>
                          <MVPSection
                            mvp={mvp}
                            stories={stories}
                            onDelete={handleDeleteMVP}
                            onEdit={handleEditMVP}
                          />
                        </div>
                      </SortableContext>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Stories Sidebar */}
            <div className="space-y-4">
              <div className="sticky top-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Available Stories
                    </CardTitle>
                    <CardDescription>
                      Groomed stories ready to assign ({availableStories.length})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search stories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Story List */}
                    <SortableContext items={filteredAvailableStories.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                        {filteredAvailableStories.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            {availableStories.length === 0 
                              ? "No groomed stories available. Create and groom stories in the Backlog."
                              : "No stories match your search"
                            }
                          </p>
                        ) : (
                          filteredAvailableStories.map(story => (
                            <SortableStoryCard key={story.id} story={story} />
                          ))
                        )}
                      </div>
                    </SortableContext>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeStory ? (
            <div className="rotate-2 scale-105">
              <StoryCard story={activeStory} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </AppLayout>
  );
}
