console.log("\x1b[36m%s\x1b[0m", `[${new Date()}] STARTING BOT`)
import dotenv from 'dotenv'
dotenv.config()
import cron from "node-cron"
import fetch from "node-fetch"
import {
  replyToMessage,
  connect,
  saveUser,
  reportError,
  buildKeyboard,
  parseBoolean,
  handleEnv,
  getPing
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
  cal,
  setLang
} from "./modules/start"
import {
  tesseract,
  ocr
} from "./modules/ocr"
import {
  useLang,
  donate,
  settingsCallback,
  handleCal
} from "./modules/callbackdata"
import {
  tr
} from "./modules/translate"
import {
  adminCache,
  settings,
  handleSettings,
  reportAdmin,
  connecting,
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

import {
  npm
} from "./modules/npm"

import {
  getTTS
} from "./modules/tts"
import {
  setUsername
} from "./modules/setusername"
import update from "./modules/update"
import {
  purge
} from "./modules/purge"
import {
  kang
} from "./modules/kang"
import {
  people
} from "./modules/people"
connect()
const bot = new Telegraf(process.env["BOT_TOKEN"] as string)
const app = express()
let port = Number(process.env["PORT"]) || 3000
if (parseBoolean(process.env["WEBHOOK"])) {
  app.get("/",
    (req, res)=> {
      res.status(403).redirect("https://butthx.vercel.app")
    })
  app.get("/cron",
    (req, res)=> {
      res.status(200).send("Running..")
    })
  //app.use(bot.webhookCallback("/"))
  //bot.telegram.setWebhook(process.env["URL"] as string)

  cron.schedule('*/3 * * * * *', () => {
    let url = String(process.env["URL"])
    if (url.endsWith("/")) {
      fetch(`${url}cron`)
    } else {
      fetch(`${url}/cron`)
    }
    if(process.env["APIURL"]) {
      fetch(process.env["APIURL"])
    }
    return 
  });
}

let aliveTime = 0
let aliveDate = new Date()
let aliveInterval = setInterval(()=> {
  aliveTime ++
}, 1000)

bot.use(saveUser)
bot.hears(new RegExp(`/start(\@${String(process.env["USERNAME"]).replace(/^\@/, "").trim()})? settings_(.*)`), handleSettings)
bot.hears(new RegExp(`\#setusername(\@${String(process.env["USERNAME"]).replace(/^\@/, "").trim()})?`, ""), setUsername)
bot.hears(new RegExp(`\@admin(s)?(\@${String(process.env["USERNAME"]).replace(/^\@/, "").trim()})?`), reportAdmin)
bot.action(/setlang\s+(.*)$/i, useLang)
bot.action("setlang", setLang)
bot.action(/cal(.*)/, handleCal)
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
bot.command("npm", npm)
bot.command("tts", getTTS)
bot.command("update", update)
bot.command("purge", purge)
bot.command("connect", connecting)
bot.command(["kang", "curi"], kang)
bot.command("people",people)
bot.command("atime", async (ctx)=> {
  let c = await getPing(ctx)
  let d = new Date(aliveTime * 1000).toISOString().substr(11, 8).split(":")
  return replyToMessage(ctx, `Alive <code>${d[0]}</code> Hours <code>${d[1]}</code> Minutes <code>${d[2]}</code> Seconds\nSince:\n<b>${aliveDate}</b>\n\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`)
})
bot.command("cal", cal)
//bot.on("inline_query", inline_query)
bot.catch(reportError)
if (parseBoolean(process.env["WEBHOOK"])) {
  bot.launch()
  app.listen(port, ()=> {
    console.log("\x1b[34m%s\x1b[0m", "[WEBHOOK] bot running..")
  })
} else {
  bot.launch().then(()=> {
    console.log("\x1b[35m%s\x1b[0m", "[POLLING] bot running..")
  })
}