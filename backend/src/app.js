import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { newsRouter } from "./routes/newsRoutes.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// app.use(
//   cors({
//     origin: env.clientOrigin.split(",").map((origin) => origin.trim()),
//   }),
// );
app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        origin === "http://localhost:5173" ||
        origin.endsWith(".pages.dev")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);
app.use(express.json({ limit: "32kb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/api/health", (_request, response) => {
  response.json({
    success: true,
    message: "Quick Headlines API is running.",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/news", newsRouter);
app.use(notFound);
app.use(errorHandler);
