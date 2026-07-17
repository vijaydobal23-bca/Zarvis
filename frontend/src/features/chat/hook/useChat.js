import { initilizeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  deleteChat,
  getMessages,
} from "../service/chat.api";
import { useDispatch } from "react-redux";
import {
  createNewChat,
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  addNewMessage,
  setMessages
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();
  
  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));

    try {
      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;

      const targetChatId = chatId || chat._id;

      if (!chatId) {
        dispatch(createNewChat({chatId: targetChatId, title: chat.title}));
        dispatch(setCurrentChatId(targetChatId));
      }

      dispatch(addNewMessage({chatId: targetChatId, role:"user" , content:message}));
      dispatch(addNewMessage({chatId: targetChatId, role:"ai", content:aiMessage.content}));

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error?.message));
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    dispatch(setLoading(true));
    try {
      const data = await getChats();
      const chatsObj = {};
      data.chats.forEach(chat => {
        chatsObj[chat._id] = {
           id: chat._id,
           title: chat.title,
           messages: [],
           lastUpdated: Date.now().toString()
        };
      });

      dispatch(setChats(chatsObj));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error?.message));
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId, chats) {
    dispatch(setCurrentChatId(chatId));
    if (chats[chatId] && chats[chatId].messages.length === 0) {
      dispatch(setLoading(true));
      try {
        const data = await getMessages(chatId);
        dispatch(setMessages({ chatId, messages: data.messages }));
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setError(error?.message));
        dispatch(setLoading(false));
      }
    }
  }

  async function handleDeleteChat(chatId, currentChatId) {
    dispatch(setLoading(true));
    try {
      await deleteChat(chatId);
      await handleGetChats();
      if (currentChatId === chatId) {
        dispatch(setCurrentChatId(null));
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error?.message));
      dispatch(setLoading(false));
    }
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
  }

  return {
    initializeSocketConnection: initilizeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    handleNewChat,
  };
};
