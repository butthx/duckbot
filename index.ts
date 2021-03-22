import dotenv from 'dotenv'
import {Telegraf} from 'telegraf'
dotenv.config()
//import {util} from './bot/util'
const bot = new Telegraf(process.env.BOT_TOKEN as string)

bot.command('start',(ctx)=>{
  ctx.reply("hai")
})
bot.command('ping',async (ctx)=>{
  ctx.reply(`PONG!\n${getPing(ctx)}`)
})
function getPing(ctx:contex){
  let date = Date.now() / 1000
  let msgd = ctx.message.date
  let p = date - msgd 
  return p.toFixed(3)
}

bot.launch().then(()=>console.log("running.."))