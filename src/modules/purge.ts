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
  isAdmin
} from "./misc"

let jobs = new Queue() // defines the constructor of the duckbot queue

export async function purge(ctx) {
  let langs = await getLang(ctx)
  try {
    if (!ctx.message.reply_to_message) return replyToMessage(ctx, langs.mustReply)
    let now = ctx.message.message_id
    let yesterday = ctx.message.reply_to_message.message_id
    let abs = Math.abs(now - yesterday)
    for (let i = 0; i < abs; i++) {
      jobs.create({
        chat_id: ctx.chat.id,
        message_id: yesterday++
      }, (now, list)=> {
        ctx.telegram.deleteMessage(now.chat_id, now.message_id).catch(e) {
          return e
        }
      })
    }
  }catch(error) {
    return reportError(error, ctx)
  }
}