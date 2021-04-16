import {replyToMessage,getPing,getLang,buildArray,getCurrentLang,isAdmin,trparseHTML,reportError,replyToUser,isIso,clearHTML,trparseMD} from "./misc"
import translate from "@vitalets/google-translate-api"
export async function tr(ctx){
  let langs = await getLang(ctx)
  try{
    let current = await getCurrentLang(ctx)
    let spl = ctx.message.text.split(" ")
    let trLang = spl[1] || current
    let isoLang = await isIso(trLang)
    if(!ctx.message.reply_to_message){
      return replyToMessage(ctx,langs.mustReply,false)
    }
    if(!isoLang){
      return replyToMessage(ctx,langs.translateLangN.replace(/\{langs\}/i,trLang),false)
    }
    if(ctx.message.reply_to_message.text){
      let text = ctx.message.reply_to_message.text
      let res = await translate(String(text),{to: String(trLang)})
      let restext = await clearHTML(res.text)
      if(ctx.message.reply_to_message.reply_markup){
        if(ctx.message.reply_to_message.reply_markup.inline_keyboard){
          let keyboard = ctx.message.reply_to_message.reply_markup.inline_keyboard
          for(let i = 0; i < keyboard.length; i++){
            let btn = keyboard[i]
            for(let r = 0; r < btn.length; r++){
                let btnText = await translate(String(btn[r].text),{to: String(trLang)})
                keyboard[i][r].text = String(btnText.text)
            }
          }
          return replyToMessage(ctx,restext,keyboard)
        }
      }
      return replyToMessage(ctx,restext,false)
    }
    if(ctx.message.reply_to_message.caption){
      let text = ctx.message.reply_to_message.caption
      let res = await translate(String(text),{to: String(trLang)})
      let restext = await clearHTML(res.text)
      return replyToMessage(ctx,restext,false)
    }
    return
  }catch(error){
    replyToMessage(ctx,langs.translateError,false)
    return reportError(error,ctx)
  }
}
