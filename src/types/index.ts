// Shared types for the requirements engineering tool

export type StoryStatus = "draft" | "groomed" | "ready-for-sprint";
export type Priority = "low" | "medium" | "high" | "critical";
export type MVPStatus = "planning" | "ready-for-sprint" | "requirements-complete";

export interface UserStory {
  id: string;
  title: string;
  role: string;
  feature: string;
  benefit: string;
  acceptanceCriteria: string;
  status: StoryStatus;
  priority: Priority;
  storyPoints: number;
  businessValue: number; // 1-100 scale
  tags: string[];
  mvpId: string | null; // null if not assigned to MVP
  createdAt: string;
  updatedAt: string;
}

export interface MVP {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  status: MVPStatus;
  stories: string[]; // Array of story IDs
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  stories: UserStory[];
  mvps: MVP[];
}
