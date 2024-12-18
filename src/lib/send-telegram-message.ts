import TelegramBot from "node-telegram-bot-api";

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("Missing TELEGRAM_BOT_TOKEN environment variable");
}

if (!process.env.TELEGRAM_GROUP_CHAT_ID) {
  throw new Error("Missing TELEGRAM_GROUP_CHAT_ID environment variable");
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;

const bot = new TelegramBot(token, { polling: false });

export async function sendTelegramMessage(message: string) {
  try {
    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    console.log("Telegram message sent successfully");
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    throw error; // Re-throw the error so the caller can handle it if needed
  }
}
