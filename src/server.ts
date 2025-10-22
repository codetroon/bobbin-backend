import { Server as HttpServer } from "http";
import app from "./app";
import config from "./config";

async function main() {
  const httpServer = new HttpServer(app);

  httpServer.listen(config.port, () => {
    console.info(`Server running on port ${config.port}`);
  });

  const exitHandler = () => {
    httpServer.close(() => {
      console.info("Server closed");
      process.exit(1);
    });
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", () => {
    console.info("SIGTERM received");
    httpServer.close();
  });
}

main();
