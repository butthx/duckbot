import {replyToMessage,getPing,getLang,buildArray,getCurrentLang,isAdmin} from "./misc"
export async function start(ctx){
  let c = await getPing(ctx)
  let langs = await getLang(ctx)
  let first_name = ctx.from.first_name
  let last_name = ctx.from.last_name || ""
  let mention = `<a href="tg://user?id=${ctx.from.id}">${first_name} ${last_name}</a>`.trim()
  let keyboard = [[{
    text: `🧚🏻‍♂️ ${langs.addGroup}`,
    url: `https://t.me/${ctx.botInfo.username}?startgroup=settings`,
    hide:true
  }], [{
    text: `💲 ${langs.donate}`,
    callback_data : "donate",
    hide:true
  },{
    text: `📖 ${langs.docsButton}`,
    callback_data :'help',
    hide:true
  }],[{
    text : `👨🏻‍🔧 ${langs.support}`,
    url : `https://t.me/Miss_DuckbotSupport`,
    hide:true
  },{
    text : `📰 ${langs.news}`,
    url : `https://t.me/Miss_DuckbotInfo`,
    hide:true
  }],[{
    text : `🌐 ${langs.btnSetlang}`,
    callback_data : "setlang",
    hide:true
  }]]
  if(ctx.chat.type !== "private"){
    return replyToMessage(ctx,`${langs.pmMessage}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,[[{text:langs.pmButton,url:`https://t.me/${ctx.botInfo.username}?start`}]])
  }
  return replyToMessage(ctx,`${langs.start.replace(/\{mention\}/i,mention)}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,keyboard)
}
export async function ping(ctx){
  let c = await getPing(ctx)
  let text = `🏓<b>PONG!</b>\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`
  return replyToMessage(ctx,text,false)
}
export async function setLang(ctx){
  let langs = await getLang(ctx)
  try{
    if(ctx.chat.type !== "private"){
      if(!await isAdmin(ctx)){
       return replyToMessage(ctx,langs.userNonAdmin,false)
     }
    }
    let data = ["en","id"]
    let textData = ["🇬🇧 English","🇮🇩 Indonesia"]
    let button = new Array()
    let currentLang = await getCurrentLang(ctx)
    for(let i = 0; i< data.length ; i++ ){
      let key = data[i]
      let json = {
        text : textData[i],
        callback_data : `setlang ${key}`,
        hide : true
      }
      button.push(json)
    }
   let keyboard = await buildArray(button,2)
    return replyToMessage(ctx,langs.langAvalible.replace(/\{lang\}/i,currentLang),keyboard)
  }catch(error){
    replyToMessage(ctx,langs.getLangError,false)
  }
}