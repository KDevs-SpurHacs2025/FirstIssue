import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Survey 폼의 실제 상태 구조
interface SurveyState {
  whyContribute: string;
  howContribute: string[];
  proudProject: string;
  proudProjectType: string;
  confidentLangs: string[];
  enjoyLangs: string[];
  learnLangs: string[];
  contribCount: string;
  pastLinks: string[];
  isCompleted: boolean;
  loading: boolean;
}

const initialState: SurveyState = {
  whyContribute: "",
  howContribute: [],
  proudProject: "",
  proudProjectType: "",
  confidentLangs: [],
  enjoyLangs: [],
  learnLangs: [],
  contribCount: "",
  pastLinks: [""],
  isCompleted: false,
  loading: false,
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    // 각 필드별 업데이트 - 팀원들이 이해하기 쉽게 명확한 이름 사용
    setWhyContribute: (state, action: PayloadAction<string>) => {
      state.whyContribute = action.payload;
    },
    setHowContribute: (state, action: PayloadAction<string[]>) => {
      state.howContribute = action.payload;
    },
    setProudProject: (state, action: PayloadAction<string>) => {
      state.proudProject = action.payload;
    },
    setProudProjectType: (state, action: PayloadAction<string>) => {
      state.proudProjectType = action.payload;
    },
    setConfidentLangs: (state, action: PayloadAction<string[]>) => {
      state.confidentLangs = action.payload;
    },
    setEnjoyLangs: (state, action: PayloadAction<string[]>) => {
      state.enjoyLangs = action.payload;
    },
    setLearnLangs: (state, action: PayloadAction<string[]>) => {
      state.learnLangs = action.payload;
    },
    setContribCount: (state, action: PayloadAction<string>) => {
      state.contribCount = action.payload;
    },
    setPastLinks: (state, action: PayloadAction<string[]>) => {
      state.pastLinks = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Survey 완료 처리
    completeSurvey: (state) => {
      state.isCompleted = true;
    },
    // Survey 초기화 (개발/테스트용)
    resetSurvey: () => {
      return initialState;
    },
  },
});

export const {
  setWhyContribute,
  setHowContribute,
  setProudProject,
  setProudProjectType,
  setConfidentLangs,
  setEnjoyLangs,
  setLearnLangs,
  setContribCount,
  setPastLinks,
  setLoading,
  completeSurvey,
  resetSurvey,
} = surveySlice.actions;

export default surveySlice.reducer;
