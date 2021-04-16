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