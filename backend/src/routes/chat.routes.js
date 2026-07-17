import {Router} from "express";
const chatRouter = Router();
import { sendMessage , getChats ,getMessages, deleteChat} from "../controller/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";


chatRouter.post("/message",authUser,sendMessage);
chatRouter.get("/" , authUser,getChats);
chatRouter.get("/:chatId/messages",authUser,getMessages);
chatRouter.get("/delete/:chatId" ,authUser, deleteChat);

export default chatRouter;