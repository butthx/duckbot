/**
* This purge using duckbot Queue to anticipation of errors!
* https://t.me/Miss_DuckBotInfo/55
* We created this Queue code ourselves and it took days to get the algorithm.
* Author : Butthx
* LICENSE : MIT
*/
import {
  Queue
} from "./queue"
import {
  reportError,
  getLang,
  replyToMessage,
  isAdmin,
  getPing
} from "./misc"

let jobs = new Queue() // defines the constructor of the duckbot queue

export async function purge(ctx) {
  let langs = await getLang(ctx)
  let c = await getPing(ctx)
  try {
    if (!ctx.message.reply_to_message) return replyToMessage(ctx, langs.mustReply)
    if (ctx.chat.type !== "private") {
      if (!await isAdmin(ctx)) {
        return replyToMessage(ctx, `${langs.userNonAdmin}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`)
      }
    }
    let split = ctx.message.text.split(" ")
    let silent = split[1] || false
    let now = ctx.message.message_id
    let yesterday = ctx.message.reply_to_message.message_id
    let abs = Math.abs(now - yesterday)
    let failed = 0
    ctx.deleteMessage(ctx.message.message_id)
    for (let i = 0; i < abs; i++) {
      jobs.create({
        chat_id: ctx.chat.id,
        message_id: yesterday++
      }, (now, list)=> {
        try {
          ctx.telegram.deleteMessage(now.chat_id, now.message_id)
        }catch(e) {
          failed ++
        }
      })
    }
    if (!silent) {
      return replyToMessage(ctx, `${langs.purgeSuccess.replace(/\{success\}/gmi, Math.floor(abs - failed)).replace(/\{failed\}/gmi, failed)}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`)
    }
    return
  }catch(error) {
    return reportError(error, ctx)
  }
}