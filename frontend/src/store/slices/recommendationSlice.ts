import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  url: string;
  goodFirstIssues: boolean;
  createdAt?: string; // "Created Date"
  lastActivity: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  contributionDirections: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  reasonForRecommendation?: string; // 추천 이유
  currentStatusDevelopmentDirection?: string; // 현재 개발 상황
}

interface RecommendationState {
  repositories: Repository[];
  filteredRepositories: Repository[];
  filters: {
    language: string[];
    difficulty: string[];
    minStars: number;
    maxStars: number;
  };
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: RecommendationState = {
  repositories: [],
  filteredRepositories: [],
  filters: {
    language: [],
    difficulty: [],
    minStars: 0,
    maxStars: 10000,
  },
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {
    setRepositories: (state, action: PayloadAction<Repository[]>) => {
      state.repositories = action.payload;
      state.filteredRepositories = action.payload;
    },
    setFilteredRepositories: (state, action: PayloadAction<Repository[]>) => {
      state.filteredRepositories = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<RecommendationState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    clearRecommendations: (state) => {
      state.repositories = [];
      state.filteredRepositories = [];
      state.error = null;
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
});

export const {
  setRepositories,
  setFilteredRepositories,
  setFilters,
  setLoading,
  setError,
  setCurrentPage,
  setTotalPages,
  clearRecommendations,
} = recommendationSlice.actions;

export default recommendationSlice.reducer;
