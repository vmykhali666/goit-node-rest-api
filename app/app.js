import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "../routes/contactsRouter.js";
import invalidUrlError from '../helpers/invalidUrlError.js';
import errorHandler from "../helpers/errorHandler.js";
import authRouter from "../routes/authRouter.js";

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(morgan(formatsLogger));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);
app.use(invalidUrlError);
app.use(errorHandler);

export default app;
