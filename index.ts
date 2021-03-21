import dotenv from 'dotenv'
dotenv.config() 
import {Telegraf} from 'telegraf'
const bot = new Telegraf(process.env.BOT_TOKEN)
bot.launch().then(()=>console.log("running"))
bot.command("start",(ctx)=>{
  ctx.reply("hi")
})