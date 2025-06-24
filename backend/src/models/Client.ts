import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  clientId: string;
  expiresAt: number; // timestamp (ms)
}

const ClientSchema = new Schema<IClient>({
  clientId: { type: String, required: true, unique: true },
  expiresAt: { type: Number, required: true },
});

const Client = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
export default Client;
