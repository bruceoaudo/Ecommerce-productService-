import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import {GetAllProducts} from './products'
import { initializeData } from "./config/init";

dotenv.config();
const PORT = process.env.PORT || "50052";

const PROTO_PATH = path.join(__dirname, "../proto/products.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const productService = {
  GetAllProducts: GetAllProducts,
};

const server = new grpc.Server();

server.addService(proto.product.ProductService.service, productService);

const start = async () => {
  await connectDB();

  await initializeData()

  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) throw err;
      console.log(`productService running on port ${PORT}`);
    }
  );
};

start().catch(console.error);

// Graceful shutdown handlers
process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.tryShutdown(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.tryShutdown(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
});

// Error handlers
["uncaughtException", "unhandledRejection"].forEach((event) => {
  process.on(event, (error) => {
    console.error(`${event}:`, error);
  });
});
