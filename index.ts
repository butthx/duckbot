import dotenv from 'dotenv'
import {Telegraf} from 'telegraf'
dotenv.config()
const bot = new Telegraf(process.env.BOT_TOKEN as string)

bot.command('start',(ctx)=>{
  ctx.reply("hai")
})

bot.launch().then(()=>console.log("running.."))