import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Filter, Download } from "lucide-react";

interface ReadinessStory {
  id: string;
  title: string;
  role: string;
  feature: string;
  benefit: string;
  acceptanceCriteria: string;
  priority: "low" | "medium" | "high" | "critical";
  storyPoints: string;
  assignee?: string;
  dependencies: string[];
  criteria: {
    hasRole: boolean;
    hasFeature: boolean;
    hasBenefit: boolean;
    hasAcceptance: boolean;
    hasEstimate: boolean;
    noDependencies: boolean;
  };
}

const mockStories: ReadinessStory[] = [
  {
    id: "US-001",
    title: "User Registration",
    role: "User",
    feature: "create an account with email and password",
    benefit: "I can access personalized features",
    acceptanceCriteria: "Given I am on registration page\nWhen I enter valid details\nThen I receive confirmation email",
    priority: "high",
    storyPoints: "5",
    assignee: "John Doe",
    dependencies: [],
    criteria: {
      hasRole: true,
      hasFeature: true,
      hasBenefit: true,
      hasAcceptance: true,
      hasEstimate: true,
      noDependencies: true
    }
  },
  {
    id: "US-002",
    title: "Product Search",
    role: "Customer",
    feature: "search for products by name or category",
    benefit: "I can quickly find what I'm looking for",
    acceptanceCriteria: "",
    priority: "medium",
    storyPoints: "8",
    dependencies: ["US-001"],
    criteria: {
      hasRole: true,
      hasFeature: true,
      hasBenefit: true,
      hasAcceptance: false,
      hasEstimate: true,
      noDependencies: false
    }
  },
  {
    id: "US-003",
    title: "Payment Processing",
    role: "",
    feature: "process payments securely",
    benefit: "",
    acceptanceCriteria: "Given user has items in cart\nWhen payment is submitted\nThen order is created",
    priority: "critical",
    storyPoints: "",
    assignee: "Sarah Wilson",
    dependencies: ["US-001", "US-004"],
    criteria: {
      hasRole: false,
      hasFeature: true,
      hasBenefit: false,
      hasAcceptance: true,
      hasEstimate: false,
      noDependencies: false
    }
  },
  {
    id: "US-004",
    title: "Shopping Cart",
    role: "Customer",
    feature: "add items to cart and manage quantities",
    benefit: "I can purchase multiple items at once",
    acceptanceCriteria: "Given I'm viewing a product\nWhen I click add to cart\nThen item appears in cart",
    priority: "high",
    storyPoints: "8",
    dependencies: [],
    criteria: {
      hasRole: true,
      hasFeature: true,
      hasBenefit: true,
      hasAcceptance: true,
      hasEstimate: true,
      noDependencies: true
    }
  }
];

const readinessCriteria = [
  { key: "hasRole", label: "Role Defined", description: "User role is specified" },
  { key: "hasFeature", label: "Feature Described", description: "Feature/functionality is clear" },
  { key: "hasBenefit", label: "Benefit Explained", description: "Value/benefit is articulated" },
  { key: "hasAcceptance", label: "Acceptance Criteria", description: "Clear acceptance criteria exist" },
  { key: "hasEstimate", label: "Story Points", description: "Effort estimate is provided" },
  { key: "noDependencies", label: "No Blockers", description: "All dependencies are resolved" }
];

export default function SprintReadiness() {
  const [stories, setStories] = useState<ReadinessStory[]>(mockStories);
  const [filter, setFilter] = useState<string>("all");
  const [selectedStories, setSelectedStories] = useState<string[]>([]);

  const getReadinessScore = (story: ReadinessStory) => {
    const total = Object.keys(story.criteria).length;
    const met = Object.values(story.criteria).filter(Boolean).length;
    return (met / total) * 100;
  };

  const isStoryReady = (story: ReadinessStory) => {
    return Object.values(story.criteria).every(Boolean);
  };

  const getStatusIcon = (met: boolean) => {
    return met ? (
      <CheckCircle className="h-4 w-4 text-status-ready" />
    ) : (
      <XCircle className="h-4 w-4 text-status-blocked" />
    );
  };

  const filteredStories = stories.filter(story => {
    switch (filter) {
      case "ready":
        return isStoryReady(story);
      case "needs-work":
        return !isStoryReady(story);
      case "blocked":
        return !story.criteria.noDependencies;
      default:
        return true;
    }
  });

  const readyCount = stories.filter(isStoryReady).length;
  const totalCount = stories.length;
  const readinessPercentage = totalCount > 0 ? (readyCount / totalCount) * 100 : 0;

  const handleSelectAll = () => {
    if (selectedStories.length === filteredStories.length) {
      setSelectedStories([]);
    } else {
      setSelectedStories(filteredStories.map(story => story.id));
    }
  };

  const handleSelectStory = (storyId: string) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sprint Readiness Checker</h1>
            <p className="text-muted-foreground">
              Verify that user stories meet all criteria for sprint planning
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button 
              disabled={selectedStories.length === 0}
              className="gap-2"
            >
              Move to Sprint ({selectedStories.length})
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sprint Ready</CardTitle>
              <CheckCircle className="h-4 w-4 text-status-ready" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-ready">{readyCount}</div>
              <p className="text-xs text-muted-foreground">
                Out of {totalCount} total stories
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Readiness %</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(readinessPercentage)}%</div>
              <Progress value={readinessPercentage} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Work</CardTitle>
              <XCircle className="h-4 w-4 text-status-blocked" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-blocked">
                {totalCount - readyCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked</CardTitle>
              <AlertTriangle className="h-4 w-4 text-status-blocked" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-blocked">
                {stories.filter(s => !s.criteria.noDependencies).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Have dependencies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stories</SelectItem>
              <SelectItem value="ready">Sprint Ready</SelectItem>
              <SelectItem value="needs-work">Needs Work</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Readiness Table */}
        <Card>
          <CardHeader>
            <CardTitle>Story Readiness Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedStories.length === filteredStories.length && filteredStories.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Story</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Points</TableHead>
                  {readinessCriteria.map((criterion) => (
                    <TableHead key={criterion.key} className="text-center">
                      {criterion.label}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStories.map((story, index) => (
                  <motion.tr
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedStories.includes(story.id)}
                        onCheckedChange={() => handleSelectStory(story.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{story.id}</div>
                        <div className="text-sm text-muted-foreground">{story.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`priority-${story.priority} border`}>
                        {story.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{story.storyPoints || "?"}</Badge>
                    </TableCell>
                    {readinessCriteria.map((criterion) => (
                      <TableCell key={criterion.key} className="text-center">
                        {getStatusIcon(story.criteria[criterion.key as keyof typeof story.criteria])}
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2">
                        <Progress value={getReadinessScore(story)} className="w-16" />
                        <span className="text-sm font-medium">
                          {Math.round(getReadinessScore(story))}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {isStoryReady(story) ? (
                        <Badge className="status-ready border">Ready</Badge>
                      ) : (
                        <Badge className="status-blocked border">Needs Work</Badge>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Criteria Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Readiness Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {readinessCriteria.map((criterion) => (
                <div key={criterion.key} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-status-ready" />
                  <div>
                    <div className="font-medium text-sm">{criterion.label}</div>
                    <div className="text-xs text-muted-foreground">{criterion.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}