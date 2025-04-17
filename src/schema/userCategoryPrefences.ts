import { Schema, model, Document, Types } from "mongoose";

interface IUserCategoryPreferences extends Document {
  userId: Types.ObjectId;
  categories: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userCategoryPreferencesSchema = new Schema<IUserCategoryPreferences>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: [],
        validate: {
          validator: (categories: Types.ObjectId[]) => {
            // Ensure no duplicate categories
            return (
              new Set(categories.map((id) => id.toString())).size ===
              categories.length
            );
          },
          message: "Duplicate categories are not allowed",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


export const UserCategoryPreferences = model<IUserCategoryPreferences>(
  "UserCategoryPreferences",
  userCategoryPreferencesSchema
);
