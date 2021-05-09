import * as googleTTS from 'google-tts-api';
import {
  getLang,
  reportError,
  replyToMessage,
  getCurrentLang,
  isIso
} from "./misc"

export async function getTTS(ctx) {
  let langs = await getLang(ctx)
  try {
    if (!ctx.message.reply_to_message) return replyToMessage(ctx, langs.mustReply, false)
    if (!ctx.message.reply_to_message.text) return replyToMessage(ctx, langs.mustReply, false)
    let text = ctx.message.text.split(" ")
    let lang = text[1] || await getCurrentLang(ctx)
    let slow = Boolean(text[2]) || false
    let isBoolean = (_string) => {
      if (_string.toLowerCase() == "true" || _string.toLowerCase() == "false") return true
      return false
    }
    if (!await isIso(lang)) {
      if (await isBoolean(lang)) {
        slow = Boolean(lang)
        lang = await getCurrentLang(ctx)
      } else {
        return replyToMessage(ctx, langs.orcLangN.replace(/\{langs\}/gmi, lang), false)
      }
    }
    let textTts = ctx.message.reply_to_message.text
    let audio = await googleTTS.getAudioUrl(textTts, {
      lang: lang,
      slow: slow,
      host: 'https://translate.google.com',
    })
    return ctx.replyWithAudio(audio, {
      title: `${Date.now()}.duckbot.mp3`,
      reply_to_message: ctx.message.reply_to_message.message_id || ctx.message.message_id
    })
  }catch(error) {
    replyToMessage(ctx, langs.ttsError, false)
    return reportError(error, ctx)
  }
}