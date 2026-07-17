import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";

import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { seatchInternet } from "./internet.service.js";

const gemniModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMNI_API_KEY,
}); 

const mistralModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
});

const searchInternetTool = tool(
  async ({ query }) => {
    return await seatchInternet(query);
  },
  {
    name: "search-internet",
    description:
      "Use this tool to serach internet for relevant information  to answer users question",
    schema: z.object({
      query: z.string().describe("The seatch query to look up on the internet"),
    }),
  }
);
const agent = createAgent({
  model: gemniModel,
  tools: [searchInternetTool],
});

export async function generateResponse(messages) {
  const response = await agent.invoke({
    messages: [
      new SystemMessage(
        `You are a helpful AI assistant named Zarvis for answring the question. if you dont know say i Dont know . id the questin required up -to date information , use the seatchInternert tool to get the latest information `
      ),
      ...messages.map((msg) => {
        if (msg.role === "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role === "ai") {
          return new AIMessage(msg.content);
        }
      }),
    ],
  });

  const lastMessage = response.messages[response.messages.length - 1];
  return lastMessage.content;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are an AI assistant that generates concise chat titles.
    Analyze the conversation and identify its primary topic.
    Create a clear, descriptive title between 3 and 8 words.
    Focus on the user's main intent or discussion theme.
    Return only the title without quotes, punctuation, or explanations.
`),
    new HumanMessage(
      `Generate a title for  that conversation base on the following first message : ${message} `,
    ),
  ]);
  return response.text;
}
 