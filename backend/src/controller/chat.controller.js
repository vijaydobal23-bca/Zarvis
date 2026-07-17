import {
  generateChatTitle,
  generateResponse,
} from "../services/ai.services.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let title = null,
    chat = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  } else {
    chat = await chatModel.findById(chatId);
  }
  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: chatId || chat._id });
  console.log(messages);

  const result = await generateResponse(messages);
  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: "ai",
  });

  res.status(201).json({
    aiMessage,
    title,
    chat,
  });
}


export async function getChats(req ,res){
  const user = req.user;

  const chats = await chatModel.find({user:user.id});
  res.status(200).json({
    message:"Chats retrieved sucessfully",
    chats
  })
}

export async function getMessages(req ,res){
  const {chatId} = req.params;

  const chat = await chatModel.findOne({_id:chatId,
    user:req.user.id
  })

  if(!chat){
    return res.status(404).json({
      message:"Chat not found",
    })
  }

  const messages = await messageModel.find({
    chat:chatId
  });

  res.status(200).json({
    message:"Message retrieved sucessfully",
    messages
  })
}


export async function deleteChat(req ,res){
  const {chatId} = req.params;
  if(!chatId){
    return res.status(404).json({
      message:"Chat not found",
    })
  }

  const chat =  await chatModel.findOneAndDelete({
    _id:chatId,
    user:req.user.id,
  });

  await messageModel.deleteMany({
    _id:chatId,
    user:req.user.id
  });

  res.status(201).json({
    message:"The chat is deleted",
    seccess:true
  })
}

