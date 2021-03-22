import dotenv from 'dotenv'
import {Telegraf} from 'telegraf'
dotenv.config()
import {util} from './bot/util'
const bot = new Telegraf(process.env.BOT_TOKEN as string)

bot.command('start',(ctx)=>{
  ctx.reply("hai")
})
bot.command('ping',async (ctx)=>{
  ctx.reply(`PONG!${util.getPing(ctx)}`)
})

bot.launch().then(()=>console.log("running.."))