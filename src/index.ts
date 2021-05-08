console.log("\x1b[36m", `[${new Date()}] STARTING BOT`)
import dotenv from 'dotenv'
dotenv.config()
import {
  replyToMessage,
  connect,
  saveUser,
  reportError,
  buildKeyboard,
  parseBoolean,
  handleEnv
} from "./modules/misc"
handleEnv()
import mongoose from "mongoose"
import express from "express"
import {
  Telegraf
} from 'telegraf'
import {
  start,
  ping,
  setLang
} from "./modules/start"
import {
  tesseract,
  ocr
} from "./modules/ocr"
import {
  useLang,
  donate,
  settingsCallback
} from "./modules/callbackdata"
import {
  tr
} from "./modules/translate"
import {
  adminCache,
  settings,
  handleSettings,
  reportAdmin
} from "./modules/admin"
import {
  getNotes,
  saveNotes,
  removeNotes,
  removeNotesAll
} from "./modules/notes"
import {
  getFilters,
  saveFilters,
  removeFilters,
  removeFiltersAll
} from "./modules/filters"
connect()
const bot = new Telegraf(process.env.BOT_TOKEN as string)
const app = express()
let port = Number(process.env.PORT) || 3000
let isWebhook = false
let _parseBoolean = async (_string)=> {
  let results = await parseBoolean(_string)
  return isWebhook = results
}
_parseBoolean(process.env.WEBHOOK)
if (isWebhook) {
  app.get("/", (req, res)=> {
    res.status(403).redirect("https://butthx.vercel.app/duckbot")
  })
  app.use(bot.webhookCallback("/"))
  bot.telegram.setWebhook(process.env.URL as string)
}
bot.use(saveUser)
bot.hears(new RegExp(`/start(\@${String(process.env.USERNAME).replace(/^\@/, "").trim()})? settings_(.*)`), handleSettings)
bot.hears(new RegExp(`\@admin(s)?(\@${String(process.env.USERNAME).replace(/^\@/, "").trim()})?`), reportAdmin)
bot.action(/setlang\s+(.*)$/i, useLang)
bot.action("donate", donate)
bot.action(/setting\s+(.*)/i, settingsCallback)
bot.command("setlang", setLang)
bot.command("start", start)
bot.command("ping", ping)
bot.command("ocrts", tesseract)
bot.command("ocr", ocr)
bot.command("tr", tr)
bot.command("save", saveNotes)
bot.command("notes", getNotes)
bot.command("clear", removeNotes)
bot.command("clearall", removeNotesAll)
bot.command("admincache", adminCache)
bot.command("settings", settings)
bot.command("filter", saveFilters)
bot.command("filters", getFilters)
bot.command("stop", removeFilters)
bot.command("stopall", removeFiltersAll)
bot.command("report", reportAdmin)
//bot.on("inline_query", inline_query)
bot.catch(reportError)
if (isWebhook) {
  app.listen(port, ()=> {
    console.log("\x1b[34m", "[WEBHOOK] bot running..")
  })
} else {
  bot.launch().then(()=> {
    console.log("\x1b[35m", "[POLLING] bot running..")
  })
}