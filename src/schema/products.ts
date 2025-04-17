import { Schema, model, Document, Types } from "mongoose";

interface IProduct extends Document {
  name: string;
  price: number;
  category: Types.ObjectId;
    imageURL: string;
    slug: string;
    description: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be positive"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    imageURL: {
      type: String,
      required: [true, "ImageURL is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>("Product", productSchema);
