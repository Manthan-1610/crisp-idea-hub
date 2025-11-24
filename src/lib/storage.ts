// LocalStorage utility for persisting data
import { UserStory, MVP, Project } from "@/types";

const STORAGE_KEY = "agile-requirements-data";

export interface StorageData {
  stories: UserStory[];
  mvps: MVP[];
}

export const storage = {
  // Get all data
  getData(): StorageData {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { stories: [], mvps: [] };
    }
    try {
      return JSON.parse(data);
    } catch {
      return { stories: [], mvps: [] };
    }
  },

  // Save all data
  setData(data: StorageData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // Stories
  getStories(): UserStory[] {
    return this.getData().stories;
  },

  saveStories(stories: UserStory[]): void {
    const data = this.getData();
    this.setData({ ...data, stories });
  },

  addStory(story: UserStory): void {
    const stories = this.getStories();
    stories.push(story);
    this.saveStories(stories);
  },

  updateStory(id: string, updates: Partial<UserStory>): void {
    const stories = this.getStories();
    const index = stories.findIndex(s => s.id === id);
    if (index !== -1) {
      stories[index] = { ...stories[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveStories(stories);
    }
  },

  deleteStory(id: string): void {
    const stories = this.getStories().filter(s => s.id !== id);
    this.saveStories(stories);
  },

  // MVPs
  getMVPs(): MVP[] {
    return this.getData().mvps;
  },

  saveMVPs(mvps: MVP[]): void {
    const data = this.getData();
    this.setData({ ...data, mvps });
  },

  addMVP(mvp: MVP): void {
    const mvps = this.getMVPs();
    mvps.push(mvp);
    this.saveMVPs(mvps);
  },

  updateMVP(id: string, updates: Partial<MVP>): void {
    const mvps = this.getMVPs();
    const index = mvps.findIndex(m => m.id === id);
    if (index !== -1) {
      mvps[index] = { ...mvps[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveMVPs(mvps);
    }
  },

  deleteMVP(id: string): void {
    const mvps = this.getMVPs().filter(m => m.id !== id);
    // Also unassign all stories from this MVP
    const stories = this.getStories();
    const updatedStories = stories.map(story => 
      story.mvpId === id ? { ...story, mvpId: null, updatedAt: new Date().toISOString() } : story
    );
    this.saveStories(updatedStories);
    this.saveMVPs(mvps);
  },

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
