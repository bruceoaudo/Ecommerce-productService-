import { Schema, model, Document, Types } from "mongoose";

interface ICategory extends Document {
  name: string;
  description: string;
  slug: string;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product", // Reference to Product model
        default: [],
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export const Category = model<ICategory>("Category", categorySchema);
