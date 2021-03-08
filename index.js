require('dotenv').config()
const {Telegraf,Markup} = require('telegraf');
// const express = require('express')
// const app = express()
const bot = new Telegraf(process.env.BOT_TOKEN)
// //setup webhook
// /*const port = process.env.PORT || 3000
// const url = process.env.URL || process.env.VERCEL_URL
// app.use(bot.webhookCallback('/webhook-bot'))
// bot.telegram.setWebhook(`${url}webhook-bot`)*/
// //import bot module
// const start_module = require('./bot/start')
// const pin_module = require('./bot/pin')
// const loop = require('./bot/loop')
// const delete_module = require('./bot/delete')
// const report_module = require('./bot/admin')
// const ban_module = require('./bot/kick')
// const eval_module = require('./bot/eval')
// const util = require('./bot/util')

// const {callback_module} = require('./bot/callback')
// //detect event
// bot.on('pinned_message', (ctx) => {
//   return pin_module.checkpin(ctx)
// })
// bot.on('callback_query',(ctx)=>{
//   return callback_module(ctx)
// })


// //handle /start text
// bot.hears(/\/start setusername|\#setusername|\#set username/gmi,(ctx)=>{
//   return start_module.setUsername(ctx)
// })
// //detect command
// bot.command('start', (ctx) => {
//   return start_module.start(ctx)
// })
//bot.command('help', (ctx) => {
 //return start_module.start(ctx)
 //})
// bot.command('purge',(ctx) =>{
//   return delete_module.deleteMessage(ctx)
// })
// bot.command('purgebw',(ctx) =>{
//   return delete_module.deleteFrom(ctx)
// })
// bot.command('report',(ctx) =>{
//   return report_module.report(ctx)
// })
// bot.command('ban',(ctx) =>{
//   return ban_module.ban(ctx)
// })
// bot.command('unban',(ctx) =>{
//   return ban_module.unban(ctx)
// })
// bot.command('kick',(ctx) =>{
//   return ban_module.kick(ctx)
// })
// bot.command('pin', (ctx) => {
//   return pin_module.pinnedMessage(ctx)
// })
// bot.command('unpin', (ctx) => {
//   return pin_module.unpinMessage(ctx)
// })
// bot.command('loop', (ctx) => {
//   return loop.loopText(ctx)
// })
// bot.command('tele', (ctx) => {
//   return eval_module.telegraf(ctx)
// })
// bot.command('id', (ctx) => {
//   return start_module.id(ctx)
// })

// //hears message
// bot.hears(/\@admin|\@admins/gmi,(ctx)=>{
//   return report_module.report(ctx)
// })
bot.command('start',(ctx)=>{
  ctx.reply('ㅤㅤ',{
    reply_markup:{
      inline_keyboard:[[{
        text :'hai',
        callback_data : 'hai'
      }]]
    }
  })
  
})
bot.action('hai',(ctx)=>{
  console.log(ctx)
})
// //launch bot
 bot.launch().then(()=> console.log('running'))
// /*app.listen(port,()=>{
//   console.log('bot running..')
// })*/
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))

// module.exports = bot
// /*
// start - done
// en/id lang - done
// help? no help go to web.
// pin ? - done
// unpin? - done
// unpin all? - done. use command /unpin all
// kick? - done
// ban? - done
// unban? - done
// delete message? - done
// broadcast use duckbot queque ? - next update!
// reply error to user ? - done.
// print text? done
// report - done
// */
// const yaml = require('js-yaml');
// const fs   = require('fs');
// try{
//   const doc = yaml.load(fs.readFileSync('./bot/lang/en.yml', 'utf8'));
//   console.log(doc);
// }catch(error){
//   console.log(error)
// }