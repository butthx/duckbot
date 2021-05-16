import {
  replyToMessage,
  replyToUser,
  isAdmin,
  getLang,
  reportError,
  getPing,
  tagAdmins
} from "./misc"
import groups from "./database/groups"
import privates from "./database/private"
import {
  Markup
} from "telegraf"
export async function adminCache(ctx) {
  let langs = await getLang(ctx)
  let c = await getPing(ctx)
  try {
    if (ctx.chat.type == "private") {
      return replyToMessage(ctx, `${langs.groupsOnly}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
    }
    let admin = await isAdmin(ctx)
    if (!admin) {
      return replyToMessage(ctx, `${langs.userNonAdmin}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
    }
    let data = await groups.findOne({
      chat_id: ctx.chat.id
    })
    if (data !== null) {
      let date = new Date(data.dateAdmin)
      let now = new Date(Date.now())
      let abs = Math.abs(now.getMinutes() - date.getMinutes())
      if (now.getFullYear() > date.getFullYear()) {
        data.admins = await ctx.getChatAdministrators()
        data.dateAdmin = Date.now()
        data = await data.save()
        return replyToMessage(ctx, `${langs.adminCacheSuccess}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
      }
      if (now.getMonth() > date.getMonth()) {
        data.admins = await ctx.getChatAdministrators()
        data.dateAdmin = Date.now()
        data = await data.save()
        return replyToMessage(ctx, `${langs.adminCacheSuccess}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
      }
      if (now.getDay() > date.getDay()) {
        data.admins = await ctx.getChatAdministrators()
        data.dateAdmin = Date.now()
        data = await data.save()
        return replyToMessage(ctx, `${langs.adminCacheSuccess}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
      }
      if (now.getHours() > date.getHours()) {
        data.admins = await ctx.getChatAdministrators()
        data.dateAdmin = Date.now()
        data = await data.save()
        return replyToMessage(ctx, `${langs.adminCacheSuccess}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
      }
      if (abs >= 10) {
        data.admins = await ctx.getChatAdministrators()
        data.dateAdmin = Date.now()
        data = await data.save()
        return replyToMessage(ctx, `${langs.adminCacheSuccess}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
      }
    }
    return replyToMessage(ctx, `${langs.adminCacheFailed}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
  }catch(error) {
    replyToMessage(ctx, `${langs.adminCacheFailed}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
    return reportError(error, ctx)
  }
}
export async function settings(ctx) {
  let langs = await getLang(ctx)
  try {
    let c = await getPing(ctx)
    if (ctx.chat.type == "private") {
      return replyToMessage(ctx, `${langs.groupsOnly}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
    }
    let admin = await isAdmin(ctx)
    if (!admin) {
      return replyToMessage(ctx, `${langs.userNonAdmin}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
    }
    let username = ctx.botInfo.username || process.env.USERNAME
    return replyToMessage(ctx, `${langs.pmMessage}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, [[{
      text: langs.pmButton, url: `https://t.me/${username}?start=settings_${ctx.chat.id}`, hide: true
    }]])
  }catch(error) {
    return reportError(error, ctx)
  }
}
export async function handleSettings(ctx) {
  let langs = await getLang(ctx)
  let c = await getPing(ctx)
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
    let value = ctx.message.text.replace(new RegExp(`^/start(\@${String(process.env.USERNAME).replace(/^\@/, "").trim()})? settings_`), "")
    let chat_id = Number(value)
    let data = await groups.findOne({
      chat_id: chat_id
    })
    if (data == null) return replyToMessage(ctx, `${langs.notFound}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
    let admin = data.admins.findIndex(el=>el.user.id == ctx.from.id)
    if (admin == -1) {
      return replyToMessage(ctx, `${langs.userNonAdmin}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
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
    return replyToMessage(ctx, `${langs.settings.replace(/\{chatId\}/i, chat_id)}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, keyboard)
  }catch(error) {
    return reportError(error, ctx)
  }
}
export async function reportAdmin(ctx) {
  let langs = await getLang(ctx)
  try {
    let c = await getPing(ctx)
    if (!ctx.message.reply_to_message) return
    let admin = await tagAdmins(ctx)
    return replyToMessage(ctx, `${langs.report}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>${admin}`, false)
  }catch(error) {
    return reportError(error, ctx)
  }
}
export async function connecting(ctx) {
  let langs = await getLang(ctx)
  let c = await getPing(ctx)
  try {
    if (ctx.chat.type == "private") {
      return replyToMessage(ctx, `${langs.groupsOnly}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`)
    }
    if (!ctx.message.reply_to_message) {
      return replyToMessage(ctx, `${langs.mustReply}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`)
    }
    if (!await isAdmin(ctx)) {
      return replyToMessage(ctx, `${langs.userNonAdmin}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`)
    }
    let data = await privates.findOne({
      chat_id: ctx.message.reply_to_message.from.id
    })
    if (data == null) {
      return replyToUser(ctx, `${langs.pmMessage}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, [[{
        text: langs.pmButton,
        url: `https://t.me/${String(process.env["USERNAME"]).replace(/^\@/, "").trim()}`
      }]])
    }
    data.connected = ctx.chat.id
    data = await data.save()
    console.log(data)
    return replyToUser(ctx, `${langs.connectSuccess}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`)
  }catch(error) {
    replyToUser(ctx, `${langs.connectError}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`)
    return reportError(error, ctx)
  }
}