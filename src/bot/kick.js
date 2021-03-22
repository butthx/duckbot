const util = require('./util')
const report_module = require('./admin')
const { lang } = require('./lang/language')
const ban_module ={
  ban : async function(ctx){
    try {
     //config language
     let language = 'en'
    if (ctx.message.from.language_code && lang[ctx.message.from.language_code]) {
     language = ctx.message.from.language_code.toLowerCase()
     }
   //running function
    let id = 0
    let spl = ctx.message.text.split(' ')
    if(ctx.message.chat.type == 'private'){
      return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
    }
    if(ctx.message.reply_to_message){
      id = ctx.message.reply_to_message.from.id
    }else if(spl[1]){
        id = Number(spl[1])
    }else{
      return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
    }
    let admin = await report_module.adminCheck(ctx,ctx.message.from.id)
    let botAdmin = await report_module.adminCheck(ctx,ctx.botInfo.id)
    let rplAdmin = await report_module.adminCheck(ctx,id)
    if(admin && botAdmin && (!rplAdmin)){
      return ctx.kickChatMember(id)
    }else{
      return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
    }
    } catch (e) {
      return util.error_log(ctx,e)
    }
  },
  unban : async function(ctx){
    try {
     //config language
     let language = 'en'
    if (ctx.message.from.language_code && lang[ctx.message.from.language_code]) {
     language = ctx.message.from.language_code.toLowerCase()
     }
   //running function
    let id = 0
    let spl = ctx.message.text.split(' ')
    if(ctx.message.chat.type == 'private'){
      return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
    }
    if(ctx.message.reply_to_message){
      id = ctx.message.reply_to_message.from.id
    }else if(spl[1]){
        id = Number(spl[1])
    }else{
      return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
    }
    let admin = await report_module.adminCheck(ctx,ctx.message.from.id)
    let botAdmin = await report_module.adminCheck(ctx,ctx.botInfo.id)
    if(admin && botAdmin)  {
      return ctx.unbanChatMember(id)
    }else{
      return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
    }
    } catch (e) {
      return util.error_log(ctx,e)
    }
  },
  kick : async function(ctx){
    try {
      if(ctx.message.chat.type == 'private'){
      return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
    }
      await this.ban(ctx)
      return await this.unban(ctx)
    } catch (e) {
      return util.error_log(ctx,e)
    }
  }
}

module.exports = ban_module