import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SurveyAnswer {
  questionId: string;
  answer: string | string[];
}

interface SurveyState {
  answers: SurveyAnswer[];
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  completedAt: string | null;
}

const initialState: SurveyState = {
  answers: [],
  currentStep: 1,
  totalSteps: 5, // 임시로 5개 단계
  isCompleted: false,
  completedAt: null,
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<SurveyAnswer>) => {
      const existingIndex = state.answers.findIndex(
        (answer) => answer.questionId === action.payload.questionId
      );

      if (existingIndex >= 0) {
        state.answers[existingIndex] = action.payload;
      } else {
        state.answers.push(action.payload);
      }
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    completeSurvey: (state) => {
      state.isCompleted = true;
      state.completedAt = new Date().toISOString();
    },
    resetSurvey: (state) => {
      state.answers = [];
      state.currentStep = 1;
      state.isCompleted = false;
      state.completedAt = null;
    },
  },
});

export const {
  setAnswer,
  nextStep,
  prevStep,
  setCurrentStep,
  completeSurvey,
  resetSurvey,
} = surveySlice.actions;

export default surveySlice.reducer;
