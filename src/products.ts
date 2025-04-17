import * as grpc from "@grpc/grpc-js";
import {Category} from './schema/categories'
import { UserCategoryPreferences } from "./schema/userCategoryPrefences";
import { Product } from "./schema/products";

export const GetAllCategories = async (
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>
) => {
  try {
    const categories = await Category.find({})

    const response = {
      categoryItems: categories.map((category) => ({
        id: (category._id as unknown as { toString(): string }).toString(),
        name: category.name,
      })),
    };

    callback(null, response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    callback({
      code: grpc.status.INTERNAL,
      message: "Failed to fetch categories",
    });
  }
};

export const SaveUserCategoryPreferences = async (
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>
) => {
  try {
    const { user_id, category_ids } = call.request;

    // Validate categories exist
    const categories = await Category.find({
      _id: { $in: category_ids },
    });

    if (categories.length !== category_ids.length) {
      throw new Error("Some categories were not found");
    }

    // Save preferences
    await UserCategoryPreferences.findOneAndUpdate(
      { userId: user_id },
      { $set: { categories: category_ids } },
      { upsert: true, new: true }
    );

    callback(null, {
      success: true,
      message: "Preferences saved successfully"
    });
  } catch (error) {
    console.error("Error saving user preferences:", error);
    callback({
      code: grpc.status.INTERNAL,
      message: "Failed to save user preferences",
    });
  }
};


export const GetAllProductsFromCategoriesUserPrefers = async (
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>
) => {
  try {
    const { user_id } = call.request;

    // First fetch categories that are tied to the userId from the userCategoryPreferences model
    const userPreferences = await UserCategoryPreferences.find({
      where: { user_id },
    });

    // Second, for each category, fetch all products belonging to that category
    const preferredCategories = userPreferences.map((pref) => pref.categories);

    if (preferredCategories.length === 0) {
      return callback(null, {
        productItems: [],
      });
    }

    const products = await Product.find({
      where: {
        category: preferredCategories,
      },
    });

    const productItems = products.map((product) => ({
      name: product.name,
      price: product.price,
      category: product.category,
      imageURL: product.imageURL,
      slug: product.slug,
      description: product.description,
    }));

    // Third, send all the products to the gateway

    callback(null, {
      productItems,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    callback({
      code: grpc.status.INTERNAL,
      message: "Failed to fetch products",
    });
  }
};
