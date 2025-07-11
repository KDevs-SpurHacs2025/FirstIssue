import mongoose, { Schema, Document } from 'mongoose';
export interface IOpenSourceSurvey extends Document {
  userId: string;
  reason: string;
  publicRepos: string[];
  repoTypes: string[];
  well: string[];
  like: string[];
  wishToLearn: string[];
  numOfExperience: number;
  experiencedUrls: string[];
  ContributionDirections: string[];
  createdAt?: Date;
}

const OpenSourceSurveySchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    reason: { type: String },
    publicRepos: { type: [String] },
    repoTypes: { type: [String] },
    well: { type: [String]},
    like: { type: [String]},
    wishToLearn: { type: [String] },
    numOfExperience: { type: Number },
    experiencedUrls: { type: [String] },
    ContributionDirections: {
      type: [String],
      enum: [
        'Code contributions',
        'Documentation',
        'Design & UI/UX',
        'Testing & Reviewing',
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOpenSourceSurvey>('OpenSourceSurvey', OpenSourceSurveySchema);