import {
  replyToMessage,
  getPing,
  getLang,
  buildArray,
  getCurrentLang,
  isAdmin,
  reportError,
  parseBoolean
} from "./misc"
import groups from "./database/groups"
import privates from "./database/private"
export async function useLang(ctx) {
  let langs = await getLang(ctx)
  try {
    let datas = ctx.callbackQuery.data
    let lang = datas.replace(/^setlang\s+/i, "").trim()
    if (ctx.chat.type == "private") {
      let data = await privates.findOne({
        chat_id: ctx.chat.id
      })
      if (data !== null) {
        data.lang = lang
        data = await data.save()
      }
    } else {
      if (!await isAdmin(ctx)) {
        return ctx.answerCbQuery(langs.userNonAdmin, {
          show_alert: true, cache_time: 60
        })
      }
      let data = await groups.findOne({
        chat_id: ctx.chat.id
      })
      if (data !== null) {
        data.lang = lang
        data = await data.save()
      }
    }
    langs = await getLang(ctx)
    let currentLang = await getCurrentLang(ctx)
    return ctx.editMessageText(langs.useLang.replace(/\{lang\}/i, currentLang), {
      parse_mode: "HTML"
    })
  }catch(error) {
    ctx.editMessageText(langs.useLangError)
    return reportError(error, ctx)
  }
}
export async function donate(ctx) {
  try {
    let langs = await getLang(ctx)
    let keyboard = [[{
      text: "nyawer.co",
      url: "https://nyawer.co/Butthx",
      hide: true
    }]]
    return ctx.editMessageText(langs.textDonate, {
      reply_markup: {
        inline_keyboard: keyboard
      }})
  }catch(error) {
    return reportError(error, ctx)
  }
}
export async function settingsCallback(ctx) {
  let langs = await getLang(ctx)
  try {
    let json = {
      "true": "✅",
      "false": "❌",
      "0": "❌",
      "1": "❗",
      "2": "❕",
      "3": "⚠️",
      "4": "✅"
    }
    let value = ctx.callbackQuery.data.split(" ")
    let chat_id = Number(value[2])
    let data = await groups.findOne({
      chat_id: chat_id
    })
    if (data == null) return
    let admin = data.admins.findIndex(el=>el.user.id == ctx.from.id)
    if (admin == -1) {
      return ctx.answerCbQuery(langs.userNonAdmin, {
        show_alert: true, cache_time: 60
      })
    }
    if (value[1] == "adminCache") {
      let date = new Date(data.dateAdmin)
      let now = new Date(Date.now())
      let abs = Math.abs(now.getMinutes() - date.getMinutes())
      if (now.getFullYear() > date.getFullYear()) {
        data.admins = await ctx.telegram.getChatAdministrators(chat_id)
        data.dateAdmin = Date.now()
        data = await data.save()
        return ctx.answerCbQuery(langs.adminCacheSuccess, {
          show_alert: true
        })
      }
      if (now.getMonth() > date.getMonth()) {
        data.admins = await ctx.telegram.getChatAdministrators(chat_id)
        data.dateAdmin = Date.now()
        data = await data.save()
        return ctx.answerCbQuery(langs.adminCacheSuccess, {
          show_alert: true
        })
      }
      if (now.getDay() > date.getDay()) {
        data.admins = await ctx.telegram.getChatAdministrators(chat_id)
        data.dateAdmin = Date.now()
        data = await data.save()
        return ctx.answerCbQuery(langs.adminCacheSuccess, {
          show_alert: true
        })
      }
      if (now.getHours() > date.getHours()) {
        data.admins = await ctx.telegram.getChatAdministrators(chat_id)
        data.dateAdmin = Date.now()
        data = await data.save()
        return ctx.answerCbQuery(langs.adminCacheSuccess, {
          show_alert: true
        })
      }
      if (abs >= 10) {
        data.admins = await ctx.telegram.getChatAdministrators(chat_id)
        data.dateAdmin = Date.now()
        data = await data.save()
        return ctx.answerCbQuery(langs.adminCacheSuccess, {
          show_alert: true
        })
      }
      return ctx.answerCbQuery(langs.adminCacheFailed, {
        show_alert: true, cache_time: 60
      })
    }
    switch (value[1]) {
      case "welcome":
        data.welcome.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "welcome-dom":
        data.welcome.deleteOldMessage.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "goodbye":
        data.goodbye.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "goodbye-dom":
        data.goodbye.deleteOldMessage.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "notes":
        data.notes.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "notes-dom":
        data.notes.deleteOldMessage.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "filters":
        data.filters.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "filters-dom":
        data.filters.deleteOldMessage.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "das":
        data.das = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "duckbotmata":
        data.duckbotmata = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "cleanEvent":
        data.cleanEvent.status = await parseBoolean(value[3])
        data.cleanEvent.pin = await parseBoolean(value[3])
        data.cleanEvent.welcome = await parseBoolean(value[3])
        data.cleanEvent.goodbye = await parseBoolean(value[3])
        data.cleanEvent.voiceChat = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "pin":
        data.cleanEvent.pin = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "join":
        data.cleanEvent.welcome = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "left":
        data.cleanEvent.goodbye = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "voiceChat":
        data.cleanEvent.voiceChat = await parseBoolean(value[3])
        data = await data.save()
        break;
      default:
      }
      let event = data.cleanEvent
      if ((!event.pin) && (!event.welcome) && (!event.goodbye) && (!event.voiceChat)) {
        data.cleanEvent.status = false
        data = await data.save()
      } else {
        data.cleanEvent.status = true
        data = await data.save()
      }
      let active = 4
      for (let element of Object.entries(event)) {
        if (element[0] !== "status") {
          if (String(element[1]) !== "true") {
            active = Number(active-1)
          }
        }
      }
      if (active <= 0) active = 0
      let keyboard = [
        [{
          text: `${json[String(data.welcome.status)]} Welcome`,
          callback_data: `setting welcome ${chat_id} ${!data.welcome.status}`,
          hide: true
        },
          {
            text: `${json[String(data.goodbye.status)]} Goodbye`,
            callback_data: `setting goodbye ${chat_id} ${!data.goodbye.status}`,
            hide: true
          }],
        [{
          text: `${json[String(data.welcome.deleteOldMessage.status)]} Clean Welcome`,
          callback_data: `setting welcome-dom ${chat_id} ${!data.welcome.deleteOldMessage.status}`,
          hide: true
        },
          {
            text: `${json[String(data.goodbye.deleteOldMessage.status)]} Clean Goodbye`,
            callback_data: `setting goodbye-dom ${chat_id} ${!data.goodbye.deleteOldMessage.status}`,
            hide: true
          }],
        [{
          text: `${json[String(data.notes.status)]} Notes`,
          callback_data: `setting notes ${chat_id} ${!data.notes.status}`,
          hide: true
        },
          {
            text: `${json[String(data.filters.status)]} Filters`,
            callback_data: `setting filters ${chat_id} ${!data.filters.status}`,
            hide: true
          }],
        [{
          text: `${json[String(data.notes.deleteOldMessage.status)]} Clean Notes`,
          callback_data: `setting notes-dom ${chat_id} ${!data.notes.deleteOldMessage.status}`,
          hide: true
        },
          {
            text: `${json[String(data.filters.deleteOldMessage.status)]} Clean Filters`,
            callback_data: `setting filters-dom ${chat_id} ${!data.filters.deleteOldMessage.status}`,
            hide: true
          }],
        [{
          text: `${json[String(data.das)]} Anti Spam`,
          callback_data: `setting das ${chat_id} ${!data.das}`,
          hide: true
        },
          {
            text: `${json[String(data.duckbotmata)]} Duckbot Mata`,
            callback_data: `setting duckbotmata ${chat_id} ${!data.duckbotmata}`,
            hide: true
          }],
        [{
          text: `${json[String(active)]} Clean Event`,
          callback_data: `setting cleanEvent ${chat_id} ${!event.status}`,
          hide: true
        },
          {
            text: `${json[String(event.pin)]} Pinned Message`,
            callback_data: `setting pin ${chat_id} ${!event.pin}`,
            hide: true
          }],
        [{
          text: `${json[String(event.welcome)]} Join`,
          callback_data: `setting join ${chat_id} ${!event.welcome}`,
          hide: true
        },
          {
            text: `${json[String(event.goodbye)]} Left`,
            callback_data: `setting left ${chat_id} ${!event.goodbye}`,
            hide: true
          }],
        [{
          text: `${json[String(event.voiceChat)]} Voice Chat`,
          callback_data: `setting voiceChat ${chat_id} ${!event.voiceChat}`,
          hide: true
        },
          {
            text: `🔄 Admin Cache`,
            callback_data: `setting adminCache ${chat_id}`,
            hide: true
          }]
      ]
      return ctx.editMessageReplyMarkup({
        inline_keyboard: keyboard
      })
    }catch(error) {
      return reportError(error, ctx)
    }
  }

  export async function handleCal(ctx) {
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
      let cb = ctx.callbackQuery
      let cbData = cb.data
      let cbText = cb.message.text.split("\n")
      let spl = cbData.split(" ")
      if (cbText.length == 1) {
        if (spl[1] == "clear" || spl[1] == "del" || spl[1] == "sum" || spl[2] == "-" || spl[2] == "+" || spl[2] == "×" || spl[2] == "÷" || spl[2] == ".") return
        let text = `${spl[2]}\n\n${cbText[0]}`
        return ctx.editMessageText(text, {
          reply_markup: {
            inline_keyboard: keyboard
          }
        })
      }
      if (cbText.length == 3) {
        let count = cbText[0]
        if (spl[1] == "clear") {
          let text = `${cbText[2]}`
          return ctx.editMessageText(text, {
            reply_markup: {
              inline_keyboard: keyboard
            }
          })
        }
        if (spl[1] == "del") {
          let spliceText = count.replace(count[count.length -1], "")
          let text = `${spliceText.trim()}\n\n${cbText[2]}`
          return ctx.editMessageText(text, {
            reply_markup: {
              inline_keyboard: keyboard
            }
          })
        }
        if (spl[1] == "sum") {
          let sum = ""
          try {
            let ev = eval(cbText[0].replace(/\×/gm, "*").replace(/\÷/gm, "/"))
            sum = ev
          }catch(e) {
            sum = ""
          }
          let text = `${sum}\n\n${cbText[2]}`
          return ctx.editMessageText(text, {
            reply_markup: {
              inline_keyboard: keyboard
            }
          })
        }
        if (spl[2] == "-" || spl[2] == "+" || spl[2] == "×" || spl[2] == "÷" || spl[2] == ".") {
          if (count[count.length -1].match(/(\÷)|(\×)|(\-)|(\+)|(\.)/)) {
            return
          } else {
            let text = `${cbText[0]}${spl[2]}\n\n${cbText[2]}`
            return ctx.editMessageText(text, {
              reply_markup: {
                inline_keyboard: keyboard
              }
            })
          }
        } else {
          let text = `${cbText[0]}${spl[2]}\n\n${cbText[2]}`
          return ctx.editMessageText(text, {
            reply_markup: {
              inline_keyboard: keyboard
            }
          })
        }
      }
    }catch(error) {
      return reportError(error, ctx)
    }
  }