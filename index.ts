'use strict'
require('dotenv').config()
const {Telegraf} = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command("start",(ctx)=>{
  ctx.reply("hi")
})
bot.launch().then(()=>console.log("running"))