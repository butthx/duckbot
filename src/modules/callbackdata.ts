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
    let cbdata = ctx.callbackQuery.data
    let lang = cbdata.replace(/^setlang\s+/i, "").trim()
    if (ctx.chat.type == "private") {
      let data = await privates.findOne({
        chat_id: ctx.chat.id
      })
      if (data !== null) {
        data.more.lang = lang
        await data.save()
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
        data.more.lang = lang
        await data.save()
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
    let value = ctx.callbackQuery.data.more.split(" ")
    let chat_id = Number(value[2])
    let data = await groups.findOne({
      chat_id: chat_id
    })
    if (data == null) return
    let admin = data.more.admins.findIndex(el=>el.user.id == ctx.from.id)
    if (admin == -1) {
      return ctx.answerCbQuery(langs.userNonAdmin, {
        show_alert: true, cache_time: 60
      })
    }
    if (value[1] == "adminCache") {
      let date = new Date(data.more.dateAdmin)
      let now = new Date(Date.now())
      let abs = Math.abs(now.getMinutes() - date.getMinutes())
      if (now.getFullYear() > date.getFullYear()) {
        data.more.admins = await ctx.telegram.getChatAdministrators(chat_id)
        data.more.dateAdmin = Date.now()
        data = await data.save()
        return ctx.answerCbQuery(langs.adminCacheSuccess, {
          show_alert: true
        })
      }
      if (now.getMonth() > date.getMonth()) {
        data.more.admins = await ctx.telegram.getChatAdministrators(chat_id)
        data.more.dateAdmin = Date.now()
        data = await data.save()
        return ctx.answerCbQuery(langs.adminCacheSuccess, {
          show_alert: true
        })
      }
      if (now.getDay() > date.getDay()) {
        data.more.admins = await ctx.telegram.getChatAdministrators(chat_id)
        data.more.dateAdmin = Date.now()
        data = await data.save()
        return ctx.answerCbQuery(langs.adminCacheSuccess, {
          show_alert: true
        })
      }
      if (now.getHours() > date.getHours()) {
        data.more.admins = await ctx.telegram.getChatAdministrators(chat_id)
        data.more.dateAdmin = Date.now()
        data = await data.save()
        return ctx.answerCbQuery(langs.adminCacheSuccess, {
          show_alert: true
        })
      }
      if (abs >= 10) {
        data.more.admins = await ctx.telegram.getChatAdministrators(chat_id)
        data.more.dateAdmin = Date.now()
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
        data.more.welcome.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "welcome-dom":
        data.more.welcome.deleteOldMessage.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "goodbye":
        data.more.goodbye.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "goodbye-dom":
        data.more.goodbye.deleteOldMessage.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "notes":
        data.more.notes.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "notes-dom":
        data.more.notes.deleteOldMessage.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "filters":
        data.more.filters.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "filters-dom":
        data.more.filters.deleteOldMessage.status = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "das":
        data.more.das = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "duckbotmata":
        data.more.duckbotmata = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "cleanEvent":
        data.more.cleanEvent.status = await parseBoolean(value[3])
        data.more.cleanEvent.pin = await parseBoolean(value[3])
        data.more.cleanEvent.welcome = await parseBoolean(value[3])
        data.more.cleanEvent.goodbye = await parseBoolean(value[3])
        data.more.cleanEvent.voiceChat = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "pin":
        data.more.cleanEvent.pin = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "join":
        data.more.cleanEvent.welcome = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "left":
        data.more.cleanEvent.goodbye = await parseBoolean(value[3])
        data = await data.save()
        break;
      case "voiceChat":
        data.more.cleanEvent.voiceChat = await parseBoolean(value[3])
        data = await data.save()
        break;
      default:
      }
      let event = data.more.cleanEvent
      if ((!event.pin) && (!event.welcome) && (!event.goodbye) && (!event.voiceChat)) {
        data.more.cleanEvent.status = false
        data = await data.save()
      } else {
        data.more.cleanEvent.status = true
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
          text: `${json[String(data.more.welcome.status)]} Welcome`,
          callback_data: `setting welcome ${chat_id} ${!data.more.welcome.status}`,
          hide: true
        },
          {
            text: `${json[String(data.more.goodbye.status)]} Goodbye`,
            callback_data: `setting goodbye ${chat_id} ${!data.more.goodbye.status}`,
            hide: true
          }],
        [{
          text: `${json[String(data.more.welcome.deleteOldMessage.status)]} Clean Welcome`,
          callback_data: `setting welcome-dom ${chat_id} ${!data.more.welcome.deleteOldMessage.status}`,
          hide: true
        },
          {
            text: `${json[String(data.more.goodbye.deleteOldMessage.status)]} Clean Goodbye`,
            callback_data: `setting goodbye-dom ${chat_id} ${!data.more.goodbye.deleteOldMessage.status}`,
            hide: true
          }],
        [{
          text: `${json[String(data.more.notes.status)]} Notes`,
          callback_data: `setting notes ${chat_id} ${!data.more.notes.status}`,
          hide: true
        },
          {
            text: `${json[String(data.more.filters.status)]} Filters`,
            callback_data: `setting filters ${chat_id} ${!data.more.filters.status}`,
            hide: true
          }],
        [{
          text: `${json[String(data.more.notes.deleteOldMessage.status)]} Clean Notes`,
          callback_data: `setting notes-dom ${chat_id} ${!data.more.notes.deleteOldMessage.status}`,
          hide: true
        },
          {
            text: `${json[String(data.more.filters.deleteOldMessage.status)]} Clean Filters`,
            callback_data: `setting filters-dom ${chat_id} ${!data.more.filters.deleteOldMessage.status}`,
            hide: true
          }],
        [{
          text: `${json[String(data.more.das)]} Anti Spam`,
          callback_data: `setting das ${chat_id} ${!data.more.das}`,
          hide: true
        },
          {
            text: `${json[String(data.more.duckbotmata)]} Duckbot Mata`,
            callback_data: `setting duckbotmata ${chat_id} ${!data.more.duckbotmata}`,
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