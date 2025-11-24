// Mock data for initial setup
import { UserStory, MVP } from "@/types";

export const mockStories: UserStory[] = [
  {
    id: "US-001",
    title: "User Registration",
    role: "User",
    feature: "create an account with email and password",
    benefit: "I can access personalized features",
    acceptanceCriteria: "Given I am on the registration page\nWhen I enter valid details\nThen I should receive a confirmation email",
    status: "groomed",
    priority: "high",
    storyPoints: 5,
    businessValue: 85,
    tags: ["Authentication", "Frontend"],
    mvpId: "mvp-1",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "US-002",
    title: "User Login",
    role: "User",
    feature: "log in with my credentials",
    benefit: "I can access my account securely",
    acceptanceCriteria: "Given I have an account\nWhen I enter correct credentials\nThen I should be logged in",
    status: "ready-for-sprint",
    priority: "high",
    storyPoints: 3,
    businessValue: 90,
    tags: ["Authentication", "Security"],
    mvpId: "mvp-1",
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z"
  },
  {
    id: "US-003",
    title: "Password Reset",
    role: "User",
    feature: "reset my password if I forget it",
    benefit: "I can regain access to my account",
    acceptanceCriteria: "Given I forgot my password\nWhen I request a reset\nThen I should receive a reset email",
    status: "groomed",
    priority: "medium",
    storyPoints: 3,
    businessValue: 60,
    tags: ["Authentication", "Email"],
    mvpId: "mvp-1",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z"
  },
  {
    id: "US-004",
    title: "Product Listing",
    role: "Customer",
    feature: "browse all available products",
    benefit: "I can see what's available to purchase",
    acceptanceCriteria: "Given I am on the homepage\nWhen I navigate to products\nThen I should see a list of all products",
    status: "ready-for-sprint",
    priority: "high",
    storyPoints: 8,
    businessValue: 95,
    tags: ["Products", "Frontend"],
    mvpId: "mvp-2",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z"
  },
  {
    id: "US-005",
    title: "Product Search",
    role: "Customer",
    feature: "search for products by name or category",
    benefit: "I can quickly find what I'm looking for",
    acceptanceCriteria: "Given I am viewing products\nWhen I enter search terms\nThen I should see relevant results",
    status: "groomed",
    priority: "high",
    storyPoints: 5,
    businessValue: 80,
    tags: ["Products", "Search"],
    mvpId: "mvp-2",
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z"
  },
  {
    id: "US-006",
    title: "Product Filters",
    role: "Customer",
    feature: "filter products by price, category, and rating",
    benefit: "I can narrow down my choices",
    acceptanceCriteria: "Given I am viewing products\nWhen I apply filters\nThen I should see filtered results",
    status: "groomed",
    priority: "medium",
    storyPoints: 5,
    businessValue: 70,
    tags: ["Products", "UX"],
    mvpId: null,
    createdAt: "2024-01-17T11:00:00Z",
    updatedAt: "2024-01-17T11:00:00Z"
  },
  {
    id: "US-007",
    title: "Product Details",
    role: "Customer",
    feature: "view detailed information about a product",
    benefit: "I can make an informed purchase decision",
    acceptanceCriteria: "Given I click on a product\nWhen the detail page loads\nThen I should see full product information",
    status: "groomed",
    priority: "high",
    storyPoints: 3,
    businessValue: 75,
    tags: ["Products", "Frontend"],
    mvpId: null,
    createdAt: "2024-01-18T09:00:00Z",
    updatedAt: "2024-01-18T09:00:00Z"
  },
  {
    id: "US-008",
    title: "Shopping Cart",
    role: "Customer",
    feature: "add products to my cart",
    benefit: "I can purchase multiple items at once",
    acceptanceCriteria: "Given I am viewing a product\nWhen I click add to cart\nThen the item should be added to my cart",
    status: "draft",
    priority: "high",
    storyPoints: 8,
    businessValue: 90,
    tags: ["Cart", "Frontend"],
    mvpId: null,
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z"
  }
];

export const mockMVPs: MVP[] = [
  {
    id: "mvp-1",
    name: "Core Authentication",
    description: "Basic user registration, login, and password management",
    targetDate: "2024-02-15",
    status: "ready-for-sprint",
    stories: ["US-001", "US-002", "US-003"],
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "mvp-2",
    name: "Product Catalog",
    description: "Product browsing, search, and basic product information",
    targetDate: "2024-03-01",
    status: "planning",
    stories: ["US-004", "US-005"],
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z"
  }
];

// Initialize storage with mock data if empty
export function initializeMockData() {
  const { stories, mvps } = require("./storage").storage.getData();
  if (stories.length === 0 && mvps.length === 0) {
    require("./storage").storage.setData({
      stories: mockStories,
      mvps: mockMVPs
    });
  }
}
