import express from "express";
import cors from "cors";

import { authRouter } from "./api/routes/Auth";
import { employeeRouter } from "./api/routes/Employee";
import { imageStoreRouter } from "./api/routes/Image";

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/auth", authRouter);
app.use("/employee", employeeRouter);
app.use("/image", imageStoreRouter);

export default app;
