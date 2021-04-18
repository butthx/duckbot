import {replyToMessage,getPing,getLang,buildArray,getCurrentLang,isAdmin,reportError} from "./misc"
import groups from "./database/groups"
import privates from "./database/private"
export async function useLang(ctx){
  let langs = await getLang(ctx)
  try{
    let data = ctx.callbackQuery.data
    let lang = data.replace(/^setlang\s+/i,"").trim()
    if(ctx.chat.type == "private"){
      let data = await privates.findOne({chat_id:ctx.chat.id})
      if(data !== null){
        data.lang = lang
        await data.save()
      }
    }else{
      if(!await isAdmin(ctx)){
        return ctx.answerCbQuery(langs.userNonAdmin,{show_alert:true,cache_time:60})
      }
      let data = await groups.findOne({chat_id:ctx.chat.id})
      if(data !== null){
        data.lang = lang
        await data.save()
      }
    }
    langs = await getLang(ctx)
    let currentLang = await getCurrentLang(ctx)
    return ctx.editMessageText(langs.useLang.replace(/\{lang\}/i,currentLang),{parse_mode:"HTML"})
  }catch(error){
    ctx.editMessageText(langs.useLangError)
    return reportError(error,ctx)
  }
}
export async function donate(ctx){
  try{
    let langs = await getLang(ctx)
    let keyboard = [[{
      text : "nyawer.co",
      url : "https://nyawer.co/Butthx",
      hide : true
    }]]
    return ctx.editMessageText(langs.textDonate,{reply_markup : {
      inline_keyboard : keyboard
    }})
  }catch(error){
    return reportError(error,ctx)
  }
}
export async function welcomedrdn(ctx){
  try{
    let langs = await getLang(ctx)
    if(!await isAdmin(ctx)){
        return ctx.answerCbQuery(langs.userNonAdmin,{show_alert:true,cache_time:60})
      }
    let data = await groups.findOne({chat_id:ctx.chat.id})
    if(data !== null){
      let json = {
        "true" : "Enable",
        "false" : "Disable"
      }
      let keyboard = [
         [{
           text : "WELCOME",
           callback_data : "welcome drdn",
           hide : true
         },{
           text : json[String(data.welcome.status)],
           callback_data : `set welcome ${!data.welcome.status}`,
           hide : true
         }],
         [{
           text : "└",
           callback_data : "text",
           hide : true
         },{
           text : "DOM",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.welcome.deleteOldMessage.status)],
           callback_data : `set welcome-dom ${!data.welcome.deleteOldMessage.status}`,
           hide : true
         }],
         [{
           text : "└",
           callback_data : "text",
           hide : true
         },{
           text : "CPH",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.welcome.captcha.status)],
           callback_data : `set captcha ${!data.welcome.captcha.status}`,
           hide : true
         }],
         [{
           text : "GOODBYE",
           callback_data : "goodbye drdn",
           hide : true
         }],
         [{
           text : "NOTES",
           callback_data : "notes drdn",
           hide : true
         }],
         [{
           text : "FILTERS",
           callback_data : "filters drdn",
           hide : true
         }],
         [{
           text : "DMATA",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.duckbotmata)],
           callback_data : `set duckbotmata ${!data.duckbotmata}`,
           hide : true
         }],
         [{
           text : "DAS",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.das)],
           callback_data : `set das ${!data.das}`,
           hide : true
         }],
         [{
           text : "CLEN",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.cleanEvent)],
           callback_data : `set cleanevent ${!data.cleanEvent}`,
           hide : true
         }]
        ]
      return ctx.editMessageReplyMarkup({inline_keyboard:keyboard})
    }
    return 
  }catch(error){
    return reportError(error,ctx)
  }
}
export async function goodbyedrdn(ctx){
  try{
    let langs = await getLang(ctx)
    if(!await isAdmin(ctx)){
        return ctx.answerCbQuery(langs.userNonAdmin,{show_alert:true,cache_time:60})
      }
    let data = await groups.findOne({chat_id:ctx.chat.id})
    if(data !== null){
      let json = {
        "true" : "Enable",
        "false" : "Disable"
      }
      let keyboard = [
         [{
           text : "WELCOME",
           callback_data : "welcome drdn",
           hide : true
         }],
         [{
           text : "GOODBYE",
           callback_data : "goodbye drdn",
           hide : true
         },{
           text : json[String(data.goodbye.status)],
           callback_data : `set goodbye ${!data.goodbye.status}`,
           hide : true
         }],
         [{
           text : "└",
           callback_data : "text",
           hide : true
         },{
           text : "DOM",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.goodbye.deleteOldMessage.status)],
           callback_data : `set goodbye-dom ${!data.goodbye.deleteOldMessage.status}`,
           hide : true
         }],
         [{
           text : "NOTES",
           callback_data : "notes drdn",
           hide : true
         }],
         [{
           text : "FILTERS",
           callback_data : "filters drdn",
           hide : true
         }],
         [{
           text : "DMATA",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.duckbotmata)],
           callback_data : `set duckbotmata ${!data.duckbotmata}`,
           hide : true
         }],
         [{
           text : "DAS",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.das)],
           callback_data : `set das ${!data.das}`,
           hide : true
         }],
         [{
           text : "CLEN",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.cleanEvent)],
           callback_data : `set cleanevent ${!data.cleanEvent}`,
           hide : true
         }]
        ]
      return ctx.editMessageReplyMarkup({inline_keyboard:keyboard})
    }
    return 
  }catch(error){
    return reportError(error,ctx)
  }
}
export async function notesdrdn(ctx){
  try{
    let langs = await getLang(ctx)
    if(!await isAdmin(ctx)){
        return ctx.answerCbQuery(langs.userNonAdmin,{show_alert:true,cache_time:60})
      }
    let data = await groups.findOne({chat_id:ctx.chat.id})
    if(data !== null){
      let json = {
        "true" : "Enable",
        "false" : "Disable"
      }
      let keyboard = [
         [{
           text : "WELCOME",
           callback_data : "welcome drdn",
           hide : true
         }],
         [{
           text : "GOODBYE",
           callback_data : "goodbye drdn",
           hide : true
         }],
         [{
           text : "NOTES",
           callback_data : "notes drdn",
           hide : true
         }],
         [{
           text : "└",
           callback_data : "text",
           hide : true
         },{
           text : "DOM",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.notes.deleteOldMessage.status)],
           callback_data : `set notes-dom ${!data.notes.deleteOldMessage.status}`,
           hide : true
         }],
         [{
           text : "FILTERS",
           callback_data : "filters drdn",
           hide : true
         }],
         [{
           text : "DMATA",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.duckbotmata)],
           callback_data : `set duckbotmata ${!data.duckbotmata}`,
           hide : true
         }],
         [{
           text : "DAS",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.das)],
           callback_data : `set das ${!data.das}`,
           hide : true
         }],
         [{
           text : "CLEN",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.cleanEvent)],
           callback_data : `set cleanevent ${!data.cleanEvent}`,
           hide : true
         }]
        ]
      return ctx.editMessageReplyMarkup({inline_keyboard:keyboard})
    }
    return 
  }catch(error){
    return reportError(error,ctx)
  }
}
export async function filtersdrdn(ctx){
  try{
    let langs = await getLang(ctx)
    if(!await isAdmin(ctx)){
        return ctx.answerCbQuery(langs.userNonAdmin,{show_alert:true,cache_time:60})
      }
    let data = await groups.findOne({chat_id:ctx.chat.id})
    if(data !== null){
      let json = {
        "true" : "Enable",
        "false" : "Disable"
      }
      let keyboard = [
         [{
           text : "WELCOME",
           callback_data : "welcome drdn",
           hide : true
         }],
         [{
           text : "GOODBYE",
           callback_data : "goodbye drdn",
           hide : true
         }],
         [{
           text : "NOTES",
           callback_data : "notes drdn",
           hide : true
         }],
         [{
           text : "FILTERS",
           callback_data : "filters drdn",
           hide : true
         }],
         [{
           text : "└",
           callback_data : "text",
           hide : true
         },{
           text : "DOM",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.filters.deleteOldMessage.status)],
           callback_data : `set filters-dom ${!data.filters.deleteOldMessage.status}`,
           hide : true
         }],
         [{
           text : "DMATA",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.duckbotmata)],
           callback_data : `set duckbotmata ${!data.duckbotmata}`,
           hide : true
         }],
         [{
           text : "DAS",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.das)],
           callback_data : `set das ${!data.das}`,
           hide : true
         }],
         [{
           text : "CLEN",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.cleanEvent)],
           callback_data : `set cleanevent ${!data.cleanEvent}`,
           hide : true
         }]
        ]
      return ctx.editMessageReplyMarkup({inline_keyboard:keyboard})
    }
    return 
  }catch(error){
    return reportError(error,ctx)
  }
}