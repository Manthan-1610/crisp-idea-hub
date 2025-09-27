import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Wand2, Save, RotateCcw, Copy, Eye } from "lucide-react";

export default function StoryBuilder() {
  const [story, setStory] = useState({
    role: "",
    feature: "",
    benefit: "",
    acceptanceCriteria: "",
    priority: "medium",
    estimate: "",
    tags: ""
  });

  const roles = [
    "User",
    "Customer", 
    "Admin",
    "Manager",
    "Developer",
    "Stakeholder",
    "System"
  ];

  const priorities = [
    { value: "low", label: "Low", color: "priority-low" },
    { value: "medium", label: "Medium", color: "priority-medium" },
    { value: "high", label: "High", color: "priority-high" },
    { value: "critical", label: "Critical", color: "priority-critical" }
  ];

  const estimates = ["1", "2", "3", "5", "8", "13", "21", "?"];

  const handleSave = () => {
    console.log("Saving story:", story);
    // In real app, this would save to backend and add to backlog
    setStory({
      role: "",
      feature: "",
      benefit: "",
      acceptanceCriteria: "",
      priority: "medium",
      estimate: "",
      tags: ""
    });
  };

  const handleAIAssist = () => {
    // Mock AI enhancement
    if (story.role && story.feature) {
      setStory(prev => ({
        ...prev,
        benefit: prev.benefit || `I can ${prev.feature.toLowerCase()} efficiently and effectively`,
        acceptanceCriteria: prev.acceptanceCriteria || `Given I am a ${prev.role.toLowerCase()}\nWhen I ${prev.feature.toLowerCase()}\nThen I should see the expected result\nAnd the system should respond appropriately`
      }));
    }
  };

  const generatePreview = () => {
    if (!story.role || !story.feature || !story.benefit) {
      return "Complete the fields above to see your user story preview.";
    }

    return `As a ${story.role}, I want ${story.feature} so that ${story.benefit}.`;
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User Story Builder</h1>
          <p className="text-muted-foreground">
            Create structured user stories with acceptance criteria using the standard template
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Story Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Story Template
                  <Button variant="outline" size="sm" onClick={handleAIAssist} className="gap-2 ml-auto">
                    <Wand2 className="h-4 w-4" />
                    AI Assist
                  </Button>
                </CardTitle>
                <CardDescription>
                  Fill in the template to create a well-structured user story
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">As a...</Label>
                  <Select value={story.role} onValueChange={(value) => setStory(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Feature */}
                <div className="space-y-2">
                  <Label htmlFor="feature">I want...</Label>
                  <Textarea
                    id="feature"
                    placeholder="Describe the desired functionality or feature"
                    value={story.feature}
                    onChange={(e) => setStory(prev => ({ ...prev, feature: e.target.value }))}
                    rows={2}
                  />
                </div>

                {/* Benefit */}
                <div className="space-y-2">
                  <Label htmlFor="benefit">So that...</Label>
                  <Textarea
                    id="benefit"
                    placeholder="Explain the value or benefit this provides"
                    value={story.benefit}
                    onChange={(e) => setStory(prev => ({ ...prev, benefit: e.target.value }))}
                    rows={2}
                  />
                </div>

                <Separator />

                {/* Acceptance Criteria */}
                <div className="space-y-2">
                  <Label htmlFor="acceptance">Acceptance Criteria</Label>
                  <Textarea
                    id="acceptance"
                    placeholder="Given [context]&#10;When [action]&#10;Then [outcome]&#10;And [additional criteria]"
                    value={story.acceptanceCriteria}
                    onChange={(e) => setStory(prev => ({ ...prev, acceptanceCriteria: e.target.value }))}
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>

                {/* Story Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={story.priority} onValueChange={(value) => setStory(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <span className={priority.color}>{priority.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Story Points</Label>
                    <Select value={story.estimate} onValueChange={(value) => setStory(prev => ({ ...prev, estimate: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Estimate" />
                      </SelectTrigger>
                      <SelectContent>
                        {estimates.map((estimate) => (
                          <SelectItem key={estimate} value={estimate}>{estimate}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., frontend, API, urgent"
                    value={story.tags}
                    onChange={(e) => setStory(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save to Backlog
                  </Button>
                  <Button variant="outline" onClick={() => setStory({
                    role: "",
                    feature: "",
                    benefit: "",
                    acceptanceCriteria: "",
                    priority: "medium",
                    estimate: "",
                    tags: ""
                  })} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your user story will appear
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Story Preview */}
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <h3 className="font-semibold mb-2">User Story</h3>
                  <p className="text-sm leading-relaxed">
                    {generatePreview()}
                  </p>
                </div>

                {/* Acceptance Criteria Preview */}
                {story.acceptanceCriteria && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Acceptance Criteria</h4>
                    <div className="p-3 bg-muted/30 rounded border font-mono text-xs whitespace-pre-line">
                      {story.acceptanceCriteria}
                    </div>
                  </div>
                )}

                {/* Story Metadata */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Story Details</h4>
                  <div className="grid gap-2">
                    {story.priority && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Priority:</span>
                        <Badge variant="secondary" className={priorities.find(p => p.value === story.priority)?.color}>
                          {priorities.find(p => p.value === story.priority)?.label}
                        </Badge>
                      </div>
                    )}
                    {story.estimate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Story Points:</span>
                        <Badge variant="outline">{story.estimate}</Badge>
                      </div>
                    )}
                    {story.tags && (
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Tags:</span>
                        <div className="flex flex-wrap gap-1">
                          {story.tags.split(",").map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}