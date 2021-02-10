const util = require('./util')
const { lang } = require('./lang/language')
const report_module = {
  report : async function(ctx){
    try {
     //config language
     let language = 'en'
    if (ctx.message.from.language_code && lang[ctx.message.from.language_code]) {
     language = ctx.message.from.language_code.toLowerCase()
     }
   //running function
    if(ctx.message.reply_to_message){
     let admin = await this.adminCheck(ctx,ctx.message.reply_to_message.from.id)
    let tagAdmin = ''
    let useAdmin = await ctx.getChatAdministrators()
    for(let i = 0; i < useAdmin.length; i++){
      tagAdmin += `<a href='tg://user?id=${useAdmin[i].user.id}'>​</a>`
      }
    if(!admin){
      util.kirimpesan(ctx,`${lang[language]. report}${tagAdmin}`)
    }
     }
    } catch (e) {
      return util.error_log(ctx,e)
    }
  },
  adminCheck : async function(ctx,id){
    try {
     if(ctx.message.callbackQuery){
      let chatId = ctx.callbackQuery.message.chat.id
      let member = await ctx.telegram.getChatMember(chatId,id)
      if(ctx.message.from.username == 'GroupAnonymousBot' || member.status == 'administrator'|| member.status == 'creator'){
        return true
      }else{
        return false
      }
      }else{
      let chatId = ctx.message.chat.id
      let member = await ctx.telegram.getChatMember(chatId,id)
      if(ctx.message.from.username == 'GroupAnonymousBot' || member.status == 'administrator'|| member.status == 'creator'){
        return true
      }else{
        return false
      }
      }
    } catch (e) {
      return false
    }
  }
}

module.exports = report_module