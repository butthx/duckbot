/*
This function is only available in duckbot, duckbot-beta,and some official bot from butthx. 
How come? Because this is a special feature.
*/
import { replyToMessage, getLang, getPing, reportError } from './misc'
import fetch from 'node-fetch'

export async function people(ctx) {
  let c = await getPing(ctx)
  let langs = await getLang(ctx)
  try {
    if (!process.env['APIURL']) return
    if (!process.env['APITOKEN']) return
    if (ctx.chat.type == 'private') return
    let msg = await replyToMessage(
      ctx,
      `Checking out all people in here!\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(
        ctx
      )}</code>`
    )
    let res = await fetch(process.env['APIURL'] as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authToken: String(process.env['APITOKEN']),
      },
      body: JSON.stringify({
        _: 'get_chat_members',
        token: String(process.env['BOT_TOKEN']),
        api_hash: String(process.env['API_HASH']),
        api_id: String(process.env['API_ID']),
        id: ctx.chat.id,
      }),
    })
    if (res.status !== 200) return
    let json = await res.json()
    if (!json.ok)
      return ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, 'Not Found!')
    let text = `People in <b>${ctx.chat.title}</b>
<code>    Online        : ${json.results.online} People,
    Recently      : ${json.results.recently} People,
    Within week   : ${json.results.within_week} People,
    Within month  : ${json.results.within_month} People,
    Long time ago : ${json.results.long_time_ago} People,
    restricted    : ${json.results.restricted} People,
    Ghost         : ${
      json.results.ghost
    } People.</code>\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`
    return ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, text, {
      parse_mode: 'HTML',
    })
  } catch (error) {
    return reportError(error, ctx)
  }
}

/*

*/
