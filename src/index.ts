console.log(`[${new Date()}] - STARTING BOT`)
import dotenv from 'dotenv'
import mongoose from "mongoose"
import express from "express"
import {Telegraf} from 'telegraf'
import {replyToMessage,connect,saveUser,reportError,buildKeyboard} from "./modules/misc"
import {start,ping,setLang} from "./modules/start"
import {tesseract,ocr} from "./modules/ocr"
import {useLang,donate,welcomedrdn,goodbyedrdn,notesdrdn,filtersdrdn} from "./modules/callbackdata"
import {tr} from "./modules/translate"
import {adminCache, settings} from "./modules/admin"
import {getNotes,saveNotes,removeNotes,removeNotesAll} from "./modules/notes"
dotenv.config()
connect()
const bot = new Telegraf(process.env.BOT_TOKEN as string)
const app = express()
let port = Number(process.env.PORT)
let isWebhook = Boolean(process.env.WEBHOOK)
if(isWebhook){
  app.get("/",(req,res)=>{
    res.status(403).redirect("https://butthx.vercel.app/duckbot")
  })
  app.use(bot.webhookCallback("/"))
  bot.telegram.setWebhook(process.env.WEBHOOK_URL as string)
}
bot.use(saveUser)
bot.action(/setlang\s+(.*)$/i,useLang)
bot.action("welcome drdn",welcomedrdn)
bot.action("goodbye drdn",goodbyedrdn)
bot.action("notes drdn",notesdrdn)
bot.action("filters drdn",filtersdrdn)
bot.action("setlang",setLang)
bot.action("donate",donate)
bot.command("setlang",setLang)
bot.command("start",start)
bot.command("ping",ping)
bot.command("ocrts",tesseract)
bot.command("ocr",ocr)
bot.command("tr",tr)
bot.command("save",saveNotes)
bot.command("notes",getNotes)
bot.command("clear",removeNotes)
bot.command("clearall",removeNotesAll)
bot.command("admincache",adminCache)
bot.command("settings",settings)
bot.catch(reportError)
if(isWebhook){
    app.listen(port,()=>{
    console.log("[WEBHOOK] bot running..")
  })
}else{
  bot.launch().then(()=>{
    console.log("[POLLING] bot running..")
  })
}