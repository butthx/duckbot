import {replyToMessage,getPing,getLang,buildArray,getCurrentLang,isAdmin,reportError} from "./misc"
import {client} from "../"
import {Api} from "telegram";

export async function start(ctx) {
  let c = await getPing(ctx)
  let langs = await getLang(ctx)
  let first_name = ctx.from.first_name
  let last_name = ctx.from.last_name || ""
  let mention = `<a href="tg://user?id=${ctx.from.id}">${first_name} ${last_name}</a>`.trim()
  let keyboard = [[{
    text: `🧚🏻‍♂️ ${langs.addGroup}`,
    url: `https://t.me/${ctx.botInfo.username}?startgroup=settings`,
    hide: true
  }],
    [{
      text: `💲 ${langs.donate}`,
      callback_data: "donate",
      hide: true
    },
      {
        text: `📖 ${langs.docsButton}`,
        callback_data: 'help',
        hide: true
      }],
    [{
      text: `👨🏻‍🔧 ${langs.support}`,
      url: `https://t.me/Miss_DuckbotSupport`,
      hide: true
    },
      {
        text: `📰 ${langs.news}`,
        url: `https://t.me/Miss_DuckbotInfo`,
        hide: true
      }],
    [{
      text: `🌐 ${langs.btnSetlang}`,
      callback_data: "setlang",
      hide: true
    }]]
  if (ctx.chat.type !== "private") {
    return replyToMessage(ctx, `${langs.pmMessage}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, [[{
      text: langs.pmButton, url: `https://t.me/${ctx.botInfo.username}?start`
    }]])
  }
  return replyToMessage(ctx, `${langs.start.replace(/\{mention\}/i, mention)}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, keyboard)
}
export async function ping(ctx) {
  let c = await getPing(ctx)
  let text = `🏓<b>PONG!</b>\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`
  return replyToMessage(ctx, text, false)
}
export async function setLang(ctx) {
  let langs = await getLang(ctx)
  let c = await getPing(ctx)
  try {
    if (ctx.chat.type !== "private") {
      if (!await isAdmin(ctx)) {
        return replyToMessage(ctx, langs.userNonAdmin, false)
      }
    }
    let data = ["en",
      "id"]
    let textData = ["🇬🇧 English",
      "🇮🇩 Indonesia"]
    let button = new Array()
    let currentLang = await getCurrentLang(ctx)
    for (let i = 0; i < data.length; i++) {
      let key = data[i]
      let json = {
        text: textData[i],
        callback_data: `setlang ${key}`,
        hide: true
      }
      button.push(json)
    }
    let keyboard = await buildArray(button, 2)
    return replyToMessage(ctx, `${langs.langAvalible.replace(/\{lang\}/i, currentLang)}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, keyboard)
  }catch(error) {
    replyToMessage(ctx, `${langs.getLangError}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
    return reportError(error, ctx)
  }
}

export async function cal(ctx) {
  try {
    let keyboard = [
      [{
        text: "Del",
        callback_data: "cal del",
        hide: true
      },
        {
          text: "Clear",
          callback_data: "cal clear",
          hide: true
        }],
      [{
        text: "(",
        callback_data: "cal add (",
        hide: true
      },
        {
          text: ")",
          callback_data: "cal add )",
          hide: true
        }],
      [{
        text: "7",
        callback_data: "cal add 7",
        hide: true
      },
        {
          text: "8",
          callback_data: "cal add 8",
          hide: true
        },
        {
          text: "9",
          callback_data: "cal add 9",
          hide: true
        },
        {
          text: "÷",
          callback_data: "cal add ÷",
          hide: true
        }],
      [{
        text: "4",
        callback_data: "cal add 4",
        hide: true
      },
        {
          text: "5",
          callback_data: "cal add 5",
          hide: true
        },
        {
          text: "6",
          callback_data: "cal add 6",
          hide: true
        },
        {
          text: "×",
          callback_data: "cal add ×",
          hide: true
        }],
      [{
        text: "1",
        callback_data: "cal add 1",
        hide: true
      },
        {
          text: "2",
          callback_data: "cal add 2",
          hide: true
        },
        {
          text: "3",
          callback_data: "cal add 3",
          hide: true
        },
        {
          text: "-",
          callback_data: "cal add -",
          hide: true
        }],
      [{
        text: ".",
        callback_data: "cal add .",
        hide: true
      },
        {
          text: "0",
          callback_data: "cal add 0",
          hide: true
        },
        {
          text: "=",
          callback_data: "cal sum",
          hide: true
        },
        {
          text: "+",
          callback_data: "cal add +",
          hide: true
        }]
    ]
    return replyToMessage(ctx, "...This is a simple calculator that you can use to calculate...", keyboard)
  }catch(error) {
    return reportError(error, ctx)
  }
}

export async function all(ctx){
  let langs = await getLang(ctx)
  let c = await getPing(ctx)
  try{
    let msg = await replyToMessage(ctx,`WARNING! I will probably spam to mentioning all members in this group.\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`)
    //let mention = ""
    let count = await ctx.getChatMembersCount()
    let result = await client.getParticipants(ctx.chat.id,{
        limit : count
      })
    let arr = new Array()
    for(let i=0; i< result.length; i++){
      if(!result[i].bot){
        arr.push(result[i])
      }
    }
    let final = await buildArray(arr,5)
    for(let i=0; i<final.length; i++){
      let d = final[i]
      let mention = ""
      for(let e=0; e< d.length; e++){
        let f = d[e]
        if(f.username){
          mention += `@${f.username} `
        }else{
          mention +=`<a href="tg://user?id=${f.id}">${f.firstName}</a> `
        }
      }
      ctx.replyWithHTML(`<b>Hey All Member!</b>\n\n${mention}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,{
        reply_to_message_id : msg.message_id
      })
    }
    //return ctx.replyWithHTML(`${text}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>${mention}`)
  }catch(error){
    return reportError(error,ctx)
  }
}