import express from "express";
import cors from "cors";

import { authRouter } from "./api/routes/Auth";
import { employeeRouter } from "./api/routes/Employee";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/employee", employeeRouter);

export default app;
