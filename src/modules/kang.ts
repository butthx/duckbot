import {
  replyToMessage,
  reportError,
  getLang
} from "./misc"
import privates from "./database/private"
import https from "https"
import fs from "fs"
import path from "path"
import sharp from "sharp"

export async function kang(ctx) {
  let langs = await getLang(ctx)
  try {
    if (!ctx.message.reply_to_message) {
      return replyToMessage (ctx, langs.mustReply)
    }
    let packName = `a${ctx.from.id}_by_${String(process.env.USERNAME).replace(/^\@/, "").trim()}`
    let found: any = false
    let packNum = 0
    while (true) {
      try {
        let pack = await ctx.telegram.getStickerSet(packName)
        if (pack.stickers.length > 120) {
          packNum ++
          packName = `a${packNum}${ctx.from.id}_by_${String(process.env.USERNAME).replace(/^\@/, "").trim()}`
        } else {
          found = pack
          break;
        }
      }catch(error) {
        break;
      }
    }
    let file_id: any = false
    if (ctx.message.reply_to_message.sticker) {
      file_id = ctx.message.reply_to_message.sticker.file_id
    }
    if (ctx.message.reply_to_message.photo) {
      file_id = ctx.message.reply_to_message.photo[ctx.message.reply_to_message.photo.length -1].file_id
    }
    if (ctx.message.reply_to_message.sticker?.is_animated) {
      return
    }
    if (!file_id) {
      return replyToMessage(ctx, langs.mustReply)
    }
    let url = await ctx.telegram.getFileLink(file_id)
    let basename = `kang-${await path.basename(url.href)}.png`
    let spl = ctx.message.text.split(" ")
    let emoji = "❤️"
    if (spl[1]) {
      emoji = spl[1]
    } else {
      if (ctx.message.reply_to_message.sticker.emoji) {
        emoji = ctx.message.reply_to_message.sticker.emoji
      }
    }
    https.get(url, async (res)=> {
      let file = fs.createWriteStream(`./download/${basename}`)
      res.pipe(file)
      file.on("error", (error)=> {
        replyToMessage(ctx, langs.kangError)
        return reportError(error, ctx)
      })
      file.on("finish", async ()=> {
        if (found) {
          let error = false
          await ctx.telegram.addStickerToSet(ctx.from.id, packName, {
            png_sticker: {
              source: await sharp(`./download/${basename}`).resize(512, 512).toBuffer()
            },
            emojis: emoji
          }).catch((e)=> {
            console.log(e)
            error = true
            fs.unlinkSync(`./download/${basename}`)
            return replyToMessage(ctx, langs.kangError)
          })
          if (!error) {
            fs.unlinkSync(`./download/${basename}`)
            return replyToMessage(ctx, langs.kangSuccess.replace(/\{packname\}/i, packName))
          }
        } else {
          let error = false
          await ctx.telegram.createNewStickerSet(ctx.from.id, packName, `${ctx.from.first_name} Kang Pack Vol ${packNum +1}`, {
            png_sticker: {
              source: await sharp(`./download/${basename}`).resize(512, 512).toBuffer()
            },
            emojis: emoji
          }).catch((e)=> {
            console.log(e)
            error = true
            fs.unlinkSync(`./download/${basename}`)
            return replyToMessage(ctx, langs.kangError)
          })
          if (!error) {
            fs.unlinkSync(`./download/${basename}`)
            return replyToMessage(ctx, langs.kangSuccess.replace(/\{packname\}/i, packName))
          }
        }
      })
    })
  }catch(error) {
    replyToMessage(ctx, langs.kangError)
    return reportError(error, ctx)
  }
}