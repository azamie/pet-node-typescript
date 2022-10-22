import { Schema, model } from 'mongoose';
import Pet from '@/resources/pet/pet.interface';

const PetSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imgURL: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<Pet>('Pet', PetSchema);
