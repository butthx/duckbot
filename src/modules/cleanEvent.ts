import groups from "./database/groups"
import {
  reportError
} from "./misc"
export async function cleanEvent(ctx) {
  try {
    if (ctx.chat.type == "private") return
    let data = await groups.findOne({
      chat_id: ctx.chat.id
    })
    if (data == null) return
    if (!data.cleanEvent.status) return
    if (ctx.message.pinned_message && data.cleanEvent.pin) return ctx.deleteMessage(ctx.message.message_id)
    if (ctx.message.new_chat_members && data.cleanEvent.welcome) return ctx.deleteMessage(ctx.message.message_id)
    if (ctx.message.left_chat_member && data.cleanEvent.goodbye) return ctx.deleteMessage(ctx.message.message_id)
    if ((ctx.message.voice_chat_participants_invited || ctx.message.voice_chat_ended || ctx.message.voice_chat_started) && data.cleanEvent.voiceChat) return ctx.deleteMessage(ctx.message.message_id)
    return
  }catch(error) {
    return reportError(error, ctx)
  }
}