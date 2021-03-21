import dotenv from 'dotenv'
dotenv.config() 
import {Telegraf} from 'telegraf'
const bot = new Telegraf(pr
bot.command('start',(ctx)=>{
  console.log(ctx)
})
bot.launch().then(()=>{
  console.log('Running..')
})