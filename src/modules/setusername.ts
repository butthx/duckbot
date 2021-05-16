import groups from "./database/groups"
import {
  getLang,
  reportError,
  replyToMessage,
  getPing
} from "./misc"

export async function setUsername(ctx) {
  let langs = await getLang(ctx)
  let c = await getPing(ctx)
  try {
    if (ctx.chat.type == "private") {
      return ctx.replyWithAnimation({
        source: "./download/setusername.gif"
      }, {
        caption: `${langs.setUsername}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`
      })
    }
    let data = await groups.findOne({
      chat_id: ctx.chat.id
    })
    if (data == null) {
      return ctx.replyWithAnimation({
        source: "./download/setusername.gif"
      }, {
        caption: `${langs.setUsername}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`
      })
    }
    let notes = data.notes.value.findIndex((el, i)=> el.key == "setusername")
    if (notes !== -1) return
    return ctx.replyWithAnimation({
      source: "./download/setusername.gif"
    }, {
      caption: `${langs.setUsername}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`
    })
  }catch(error) {
    replyToMessage(ctx, `${langs.notesNotFound}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`, false)
    return reportError(error, ctx)
  }
}