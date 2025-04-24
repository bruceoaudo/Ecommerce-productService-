import { Product } from "../schema/products";
import { Category } from "../schema/categories";

export const initCategories = async () => {
  try {
    // Check if categories already exist to avoid duplicates
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      console.log("Categories already initialized");
      return;
    }

    // Create 5 categories
    const categories = await Category.insertMany([
      {
        name: "Electronics",
        description: "Latest electronic gadgets and devices",
        slug: "electronics",
        products: [],
      },
      {
        name: "Clothing",
        description: "Fashionable clothing for all ages",
        slug: "clothing",
        products: [],
      },
      {
        name: "Home & Garden",
        description: "Everything for your home and garden",
        slug: "home-garden",
        products: [],
      },
      {
        name: "Books",
        description: "Wide variety of books for all interests",
        slug: "books",
        products: [],
      },
      {
        name: "Sports & Outdoors",
        description: "Equipment for sports and outdoor activities",
        slug: "sports-outdoors",
        products: [],
      },
    ]);

    console.log("Categories initialized successfully");
    return categories;
  } catch (error) {
    console.error("Error initializing categories:", error);
    throw error;
  }
};

export const initProducts = async () => {
  try {
    // Check if products already exist to avoid duplicates
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log("Products already initialized");
      return;
    }

    // Get all categories
    const categories = await Category.find();
    if (categories.length === 0) {
      throw new Error("No categories found. Initialize categories first.");
    }

    // Create products for each category
    const products = [];
    for (const category of categories) {
      const categoryProducts = await Product.insertMany([
        {
          name: `Premium ${category.name} Product 1`,
          price: 99.99,
          category: category._id,
          description: `High-quality ${category.name} product with advanced features`,
          imageURL: `https://example.com/images/${category.slug}-1.jpg`,
          slug: `${category.slug}-premium-1`,
        },
        {
          name: `Standard ${category.name} Product 2`,
          price: 49.99,
          category: category._id,
          description: `Affordable ${category.name} product for everyday use`,
          imageURL: `https://example.com/images/${category.slug}-2.jpg`,
          slug: `${category.slug}-standard-2`,
        },
      ]);

      // Update category with product references
      await Category.findByIdAndUpdate(
        category._id,
        { $push: { products: { $each: categoryProducts.map((p) => p._id) } } },
        { new: true }
      );

      products.push(...categoryProducts);
    }

    console.log("Products initialized successfully");
    return products;
  } catch (error) {
    console.error("Error initializing products:", error);
    throw error;
  }
};

// Initialization function that calls both
export const initializeData = async () => {
  await initCategories();
  await initProducts();
};
