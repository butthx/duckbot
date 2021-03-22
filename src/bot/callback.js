const util = require('./util')
const {lang} = require('./lang/language')
const report_module = require('./admin')
async function callback_module(ctx) {
  try {
    let data = ctx.callbackQuery.data;
    //config language
    let language = 'en'
    if (ctx.callbackQuery.from.language_code && lang[ctx.callbackQuery.from.language_code]) {
      language = ctx.callbackQuery.from.language_code.toLowerCase()
    }
    if(/unpinall yes/i.exec(data)){
      try{
        let admin = await report_module.adminCheck(ctx,ctx.callbackQuery.message.from.id)
        if(admin){
          return ctx.editMessageText(lang[language].totalySure, {
        reply_markup: {
          inline_keyboard: [[{
            text: lang[language].unpinAllButton,
            callback_data : 'unpinall clear'
          ,hide:true}],[{
              text: "No!",
              callback_data: 'unpinall no'
            ,hide:true}]]}})
        }
      }catch(error){
        return util.error_log(ctx,error)
      }
    }
    if(/unpinall no/i.exec(data)){
      try{
        let admin = await report_module.adminCheck(ctx,ctx.callbackQuery.message.from.id)
        if(admin){
        return ctx.telegram.deleteMessage(ctx.callbackQuery.message.chat.id,ctx.callbackQuery.message.message_id)
        }
      }catch(error){
        return util.error_log(ctx,error)
      }
    }
    if (/unpinall clear/i.exec(data)) {
      try{
        let admin = await report_module.adminCheck(ctx,ctx.callbackQuery.message.from.id)
      if(admin){
      ctx.telegram.deleteMessage(ctx.callbackQuery.message.chat.id,ctx.callbackQuery.message.message_id)
      return ctx.unpinAllChatMessages()
      }
      }catch(error){
        return util.error_log(ctx,error)
      }
    }
    if (/help/i.exec(data)) {
      try{
        return ctx.editMessageText(lang[language].help,{reply_markup:{inline_keyboard:[[{text : '🗒️ Docs',url : 'https://t.me/Miss_Duckbotinfo',hide:true},{text : '📢 Channel',url : 'https://t.me/Miss_Duckbotinfo',hide:true}],[{text : '👥 Group',url : 'https://t.me/Miss_DuckbotSupport',hide:true},{text:'⚙️ Set Username',callback_data : 'set username',hide:true}],[{text:`❌ ${lang[language].close}`,callback_data : 'close',hide:true}]]}})
      }catch(error){
        return util.error_log(ctx,error)
      }
    }
    if(/set username/i.exec(data)){
      try{
        return ctx.replyWithAnimation('CgACAgUAAxkBAAObYAkiJAUIT51Q3ZvG8_xteDoKC9MAAvEAAx2fiVenbESkzdblXh4E',{caption : `How to set username?\n• Goto settings and fill in the username\n• Username must at least 5 letters or numbers\n• The username notification must be green text with the words 'username is available'\n#setusername\n©️ Miss Duckbot ${new Date().getFullYear()}`,reply_to_message_id : ctx.callbackQuery.message.message_id,reply_markup:{inline_keyboard:[[{text:`❌ ${lang[language].close}`,callback_data:'close',hide:true}]]}})
      // change file_id with this if published!
      //'CgACAgUAAxkBAAObYAkiJAUIT51Q3ZvG8_xteDoKC9MAAvEAAx2fiVenbESkzdblXh4E'
      }catch(error){
        return util.error_log(ctx,error)
      }
    }
    if(/close/i.exec(data)){
      try{
        return ctx.telegram.deleteMessage(ctx.callbackQuery.message.chat.id,ctx.callbackQuery.message.message_id)
      }catch(error){
        return util.error_log(ctx,error)
      }
    }
  } catch (error) {
    return util.error_log(ctx,error)
  }
}
module.exports = { callback_module }
