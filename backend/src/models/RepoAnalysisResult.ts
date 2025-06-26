import mongoose, { Schema, Document } from 'mongoose';
import { SkillLevel } from '../services/geminiService.js';

export interface IRepoAnalysisResult extends Document {
  userId: string;
  repoUrl: string;
  repoType?: string;
  devDirection: string;
  languages: { name: string; skill: SkillLevel }[];
  frameworksUsed: { name: string; skill: SkillLevel }[];
  packagesUsed: { name: string; skill: SkillLevel }[];
  habits: { strengths: string[]; improvements: string[] };
  overallSkillLevel: SkillLevel;
  error?: string;
  detail?: string;
  rawGeminiResponse?: string;
  createdAt?: Date;
}

const RepoAnalysisResultSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    repoUrl: { type: String, required: true },
    repoType: { type: String },
    devDirection: { type: String },
    languages: { type: [ { name: String, skill: String } ] },
    frameworksUsed: { type: [ { name: String, skill: String } ] },
    packagesUsed: { type: [ { name: String, skill: String } ] },
    habits: {
      strengths: { type: [String] },
      improvements: { type: [String] }
    },
    overallSkillLevel: { type: String },
    error: { type: String },
    detail: { type: String },
    rawGeminiResponse: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IRepoAnalysisResult>('RepoAnalysisResult', RepoAnalysisResultSchema);
