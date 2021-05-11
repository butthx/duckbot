import groups from "./database/groups"
import {
  getLang,
  reportError,
  replyToMessage
} from "./misc"

export async function setUsername(ctx) {
  let langs = await getLang(ctx)
  try {
    if (ctx.chat.type == "private") {
      return ctx.replyWithAnimation({
        source: "./download/setusername.gif"
      }, {
        caption: langs.setUsername
      })
    }
    let data = await groups.findOne({
      chat_id: ctx.chat.id
    })
    if (data == null) {
      return ctx.replyWithAnimation({
        source: "./download/setusername.gif"
      }, {
        caption: langs.setUsername
      })
    }
    let notes = data.more.notes.value.findIndex((el, i)=> el.key == "setusername")
    if (notes !== -1) return
    return ctx.replyWithAnimation({
      source: "./download/setusername.gif"
    }, {
      caption: langs.setUsername
    })
  }catch(error) {
    replyToMessage(ctx, langs.notesNotFound, false)
    return reportError(error, ctx)
  }
}