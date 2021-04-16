import dotenv from 'dotenv'
import mongoose from "mongoose"
import {Telegraf} from 'telegraf'
import {replyToMessage,connect,saveUser,reportError,buildKeyboard} from "./modules/misc"
import {start,ping,setLang} from "./modules/start"
import {tesseract,ocr} from "./modules/ocr"
import {useLang,donate} from "./modules/callbackdata"
import {tr} from "./modules/translate"
dotenv.config()
connect()
const bot = new Telegraf(process.env.BOT_TOKEN as string)
bot.use(saveUser)
bot.hears(/^\/start(\@Me_DuckBot)?\s+settings$/i,(ctx)=>{
  return replyToMessage(ctx,"Settings Avalible : ",false)
})
bot.action(/setlang\s+(.*)$/i,useLang)
bot.action("setlang",setLang)
bot.action("donate",donate)
bot.command("setlang",setLang)
bot.command("start",start)
bot.command("ping",ping)
bot.command("ocrts",tesseract)
bot.command("ocr",ocr)
bot.command("tr",tr)
bot.catch(reportError)
bot.launch().then(()=>{console.log("running..");})