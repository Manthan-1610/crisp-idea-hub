import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  Workflow, 
  MessageSquare, 
  Settings,
  CheckCircle,
  Clock
} from "lucide-react";

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  type: "integration" | "file" | "notification";
  status: "available" | "configured" | "pending";
  formats?: string[];
}

const exportOptions: ExportOption[] = [
  {
    id: "jira",
    name: "Jira",
    description: "Export user stories directly to Jira as issues with acceptance criteria",
    icon: Workflow,
    type: "integration",
    status: "configured"
  },
  {
    id: "taiga",
    name: "Taiga",
    description: "Sync user stories to Taiga project management platform",
    icon: Workflow,
    type: "integration", 
    status: "available"
  },
  {
    id: "trello",
    name: "Trello",
    description: "Create Trello cards from user stories with checklists",
    icon: Workflow,
    type: "integration",
    status: "available"
  },
  {
    id: "json",
    name: "JSON Export",
    description: "Download stories in structured JSON format for custom integrations",
    icon: FileJson,
    type: "file",
    status: "available",
    formats: ["JSON"]
  },
  {
    id: "csv",
    name: "CSV/Excel Export", 
    description: "Export to CSV or Excel for spreadsheet analysis and reporting",
    icon: FileSpreadsheet,
    type: "file",
    status: "available",
    formats: ["CSV", "XLSX"]
  },
  {
    id: "slack",
    name: "Slack Notifications",
    description: "Send updates and summaries to Slack channels",
    icon: MessageSquare,
    type: "notification",
    status: "pending"
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Post sprint readiness reports to Teams channels",
    icon: MessageSquare,
    type: "notification",
    status: "available"
  }
];

const mockProjects = [
  { id: "1", name: "E-commerce Platform" },
  { id: "2", name: "Mobile Banking App" },
  { id: "3", name: "Analytics Dashboard" }
];

export default function Exports() {
  const [selectedProject, setSelectedProject] = useState<string>("1");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [exportType, setExportType] = useState<string>("current-sprint");
  const [exportFormat, setExportFormat] = useState<string>("json");

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "configured":
        return <CheckCircle className="h-4 w-4 text-status-ready" />;
      case "pending":
        return <Clock className="h-4 w-4 text-status-draft" />;
      default:
        return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "configured":
        return <Badge className="status-ready border">Configured</Badge>;
      case "pending":
        return <Badge className="status-draft border">Setup Required</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  const handleExport = () => {
    console.log("Exporting:", {
      project: selectedProject,
      options: selectedOptions,
      type: exportType,
      format: exportFormat
    });
    // In real app, this would trigger the actual export process
  };

  const groupedOptions = {
    integration: exportOptions.filter(opt => opt.type === "integration"),
    file: exportOptions.filter(opt => opt.type === "file"),
    notification: exportOptions.filter(opt => opt.type === "notification")
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Exports & Integrations</h1>
          <p className="text-muted-foreground">
            Export user stories and sync with external tools and platforms
          </p>
        </div>

        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Export Configuration</CardTitle>
            <CardDescription>
              Configure what and how you want to export your requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="export-type">Export Scope</Label>
                <Select value={exportType} onValueChange={setExportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-stories">All Stories</SelectItem>
                    <SelectItem value="sprint-ready">Sprint Ready Stories</SelectItem>
                    <SelectItem value="current-sprint">Current Sprint</SelectItem>
                    <SelectItem value="mvp">Selected MVP</SelectItem>
                    <SelectItem value="custom">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Integration Platforms</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {groupedOptions.integration.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`cursor-pointer transition-all ${
                  selectedOptions.includes(option.id) ? 'ring-2 ring-primary' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedOptions.includes(option.id)}
                          onCheckedChange={() => handleOptionToggle(option.id)}
                        />
                        <option.icon className="h-5 w-5" />
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(option.status)}
                        {getStatusBadge(option.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <Separator />

        {/* File Export Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">File Exports</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {groupedOptions.file.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`cursor-pointer transition-all ${
                  selectedOptions.includes(option.id) ? 'ring-2 ring-primary' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedOptions.includes(option.id)}
                          onCheckedChange={() => handleOptionToggle(option.id)}
                        />
                        <option.icon className="h-5 w-5" />
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                      </div>
                      {getStatusBadge(option.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    {option.formats && (
                      <div className="flex gap-1">
                        {option.formats.map((format) => (
                          <Badge key={format} variant="secondary" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Notification Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {groupedOptions.notification.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`cursor-pointer transition-all ${
                  selectedOptions.includes(option.id) ? 'ring-2 ring-primary' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedOptions.includes(option.id)}
                          onCheckedChange={() => handleOptionToggle(option.id)}
                        />
                        <option.icon className="h-5 w-5" />
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(option.status)}
                        {getStatusBadge(option.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Export Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Ready to Export?</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedOptions.length} option(s) selected for "{mockProjects.find(p => p.id === selectedProject)?.name}"
                </p>
              </div>
              <Button 
                onClick={handleExport}
                disabled={selectedOptions.length === 0}
                size="lg"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Start Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}