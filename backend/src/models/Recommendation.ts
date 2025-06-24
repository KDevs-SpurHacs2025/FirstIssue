import mongoose, { Schema, Document } from 'mongoose';
import { SkillLevel } from '../services/geminiService';

export interface IRecommendation extends Document {
  userId: string;
  Rank: number;
  SuitabilityScore: string;
  RepoName: string;
  RepoURL: string;
  CreatedDate: string;
  LatestUpdatedDate: string;
  LanguagesFrameworks: string[];
  Difficulties: SkillLevel;
  ShortDescription: string;
  ReasonForRecommendation: string;
  CurrentStatusDevelopmentDirection: string;
  GoodFirstIssue: boolean;
  ContributionDirections: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  createdAt?: Date;
}

const RecommendationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    Rank: { type: Number, required: true },
    SuitabilityScore: { type: String, required: true },
    RepoName: { type: String, required: true },
    RepoURL: { type: String, required: true },
    CreatedDate: { type: String, required: true },
    LatestUpdatedDate: { type: String, required: true },
    LanguagesFrameworks: { type: [String], required: true },
    Difficulties: { type: String, required: true },
    ShortDescription: { type: String, required: true },
    ReasonForRecommendation: { type: String, required: true },
    CurrentStatusDevelopmentDirection: { type: String, required: true },
    GoodFirstIssue: { type: Boolean, required: true },
    ContributionDirections: {
      type: [
        {
          number: Number,
          title: String,
          description: String
        }
      ],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
