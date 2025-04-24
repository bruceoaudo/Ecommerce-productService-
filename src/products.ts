import * as grpc from "@grpc/grpc-js";
import { Product } from "./schema/products";

export const GetAllProducts = async (
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>
) => {
  try {
    // Fetch all products with their category details
    const products = await Product.find().populate("category", "name");

    if (!products || products.length === 0) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "No products found",
      });
    }

    // Map to the response format
    const productItems = products.map((product) => ({
      name: product.name,
      price: product.price,
      category: (product.category as any).name, // Cast to any since we populated
      imageURL: product.imageURL,
      slug: product.slug,
      description: product.description,
    }));

    callback(null, { productItems });
  } catch (error) {
    console.error("Error fetching products:", error);
    callback({
      code: grpc.status.INTERNAL,
      message: "Failed to fetch products",
    });
  }
};
