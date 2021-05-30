import * as googleTTS from 'google-tts-api'
import { getLang, reportError, replyToMessage, getCurrentLang, isIso, getPing } from './misc'
import https from 'https'
import fs from 'fs'
import path from 'path'

export async function getTTS(ctx) {
  let langs = await getLang(ctx)
  let c = await getPing(ctx)
  try {
    if (!ctx.message.reply_to_message)
      return replyToMessage(
        ctx,
        `${langs.mustReply}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,
        false
      )
    if (!ctx.message.reply_to_message.text)
      return replyToMessage(
        ctx,
        `${langs.mustReply}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,
        false
      )
    let text = ctx.message.text.split(' ')
    let lang = text[1] || (await getCurrentLang(ctx))
    let slow = Boolean(text[2]) || false
    let isBoolean = (_string) => {
      if (_string.toLowerCase() == 'true' || _string.toLowerCase() == 'false') return true
      return false
    }
    if (!(await isIso(lang))) {
      if (await isBoolean(lang)) {
        slow = Boolean(lang)
        lang = await getCurrentLang(ctx)
      } else {
        return replyToMessage(
          ctx,
          `${langs.orcLangN.replace(
            /\{langs\}/gim,
            lang
          )}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,
          false
        )
      }
    }
    let textTts = ctx.message.reply_to_message.text
    let audio = await googleTTS.getAudioUrl(textTts, {
      lang: lang,
      slow: slow,
      host: 'https://translate.google.com',
    })
    let file_name = `tts-${Date.now()}.duckbot.mp3`
    https.get(audio, async (res) => {
      let file = fs.createWriteStream(`./download/${file_name}`)
      res.pipe(file)
      file.on('error', async (error) => {
        return replyToMessage(
          ctx,
          `${langs.ttsError}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,
          false
        )
      })
      file.on('finish', async () => {
        await ctx.replyWithAudio(
          {
            source: `./download/${file_name}`,
          },
          {
            reply_to_message: ctx.message.message_id,
          }
        )
        return fs.unlinkSync(`./download/${file_name}`)
      })
    })
    return
  } catch (error) {
    replyToMessage(
      ctx,
      `${langs.ttsError}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,
      false
    )
    return reportError(error, ctx)
  }
}
