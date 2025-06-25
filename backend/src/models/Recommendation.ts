import mongoose, { Schema, Document } from 'mongoose';
import { SkillLevel } from '../services/geminiService.js';

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
    Rank: { type: Number},
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
          title: {
            type: String,
            enum: [
              'Code contributions',
              'Documentation',
              'Design & UI/UX',
              'Testing & Reviewing'
            ],
            required: true
          },
          description: String
        }
      ],
      required: true
    }
  },
  { timestamps: true }
);

export function mapRecommendationFields(jsonRec: any) {
  return {
    Rank: jsonRec["Rank"],
    SuitabilityScore: jsonRec["Suitability Score"],
    RepoName: jsonRec["Repo Name"],
    RepoURL: jsonRec["Repo URL"],
    CreatedDate: jsonRec["Created Date"],
    LatestUpdatedDate: jsonRec["Latest Updated Date"],
    LanguagesFrameworks: jsonRec["Languages/Frameworks"],
    Difficulties: jsonRec["Difficulties"],
    ShortDescription: jsonRec["Short Description"],
    ReasonForRecommendation: jsonRec["ReasonForRecommendation"],
    CurrentStatusDevelopmentDirection: jsonRec["CurrentStatusDevelopmentDirection"],
    GoodFirstIssue: jsonRec["GoodFirstIssue"],
    ContributionDirections: jsonRec["ContributionDirections"]
  };
}

export default mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
