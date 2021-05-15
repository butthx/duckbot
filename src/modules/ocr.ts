import Tesseract from 'tesseract.js';
import ocrSpace from "ocr-space-api-wrapper"
import {
  replyToMessage,
  getPing,
  getLang,
  buildArray,
  getCurrentLang,
  isAdmin,
  clearHTML,
  reportError
} from "./misc"
import https from "https"
import fs from "fs"
import path from "path"
export async function tesseract(ctx) {
  let langs = await getLang(ctx)
  try {
    let spl = ctx.message.text.split(" ")
    let langOcr = spl[1] || "eng"
    let onlyLang = ["afr",
      "amh",
      "ara",
      "asm",
      "aze",
      "aze_cyrl",
      "bel",
      "ben",
      "bod",
      "bos",
      "bul",
      "cat",
      "ceb",
      "ces",
      "chi_sim",
      "chi_tra",
      "chr",
      "cym",
      "dan",
      "deu",
      "dzo",
      "ell",
      "eng",
      "enm",
      "epo",
      "est",
      "eus",
      "fas",
      "fin",
      "fra",
      "frk",
      "frm",
      "gle",
      "glg",
      "grc",
      "guj",
      "hat",
      "heb",
      "hin",
      "hrv",
      "hun",
      "iku",
      "ind",
      "isl",
      "ita",
      "ita_old",
      "jav",
      "jpn",
      "kan",
      "kat",
      "kat_old",
      "kaz",
      "khm",
      "kir",
      "kor",
      "kur",
      "lao",
      "lat",
      "lav",
      "lit",
      "mal",
      "mar",
      "mkd",
      "mlt",
      "msa",
      "mya",
      "nep",
      "nld",
      "nor",
      "ori",
      "pan",
      "pol",
      "por",
      "pus",
      "ron",
      "rus",
      "san",
      "sin",
      "slk",
      "slv",
      "spa",
      "spa_old",
      "sqi",
      "srp",
      "srp_latn",
      "swa",
      "swe",
      "syr",
      "tam",
      "tel",
      "tgk",
      "tgl",
      "tha",
      "tir",
      "tur",
      "uig",
      "ukr",
      "urd",
      "uzb",
      "uzb_cyrl",
      "vie",
      "yid"]
    if (!ctx.message.reply_to_message) {
      return replyToMessage(ctx, langs.ocrReply, false)
    }
    if (!ctx.message.reply_to_message.photo) {
      return replyToMessage(ctx, langs.ocrReply, false)
    }
    if (!onlyLang.includes(langOcr)) {
      return replyToMessage(ctx, langs.orcLangN.replace(/\{langs\}/i, langOcr), false)
    }
    let msg = await replyToMessage(ctx, langs.ocrLoading.replace(/\{langs\}/i, langOcr), false)
    let file_id = ctx.message.reply_to_message.photo[ctx.message.reply_to_message.photo.length -1].file_id
    let url = await ctx.telegram.getFileLink(file_id)
    let file_name = `${Date.now()}.${await path.basename(url.href)}`
    https.get(url, async (res)=> {
      let file = fs.createWriteStream(`./ocr/${file_name}`)
      res.pipe(file)
      file.on("error", async (error)=> {
        return replyToMessage(ctx, langs.ocrError, false)
      })
      file.on("finish", async ()=> {
        try {
          let data = await Tesseract.recognize(`./ocr/${file_name}`, langOcr)
          let ocrText = `${langs.ocrSuccess.replace(/\{langs\}/i, langOcr)}\n${await clearHTML(data.data.text)}`
          /*{logger: m => {
            ctx.telegram.editMessageText(msg.chat.id,msg.message_id,undefined,`${langs.ocrLoading.replace(/\{langs\}/i,langOcr)}\nStatus: ${m.status}`,{parse_mode:"HTML"})
          }}*/
          fs.unlinkSync(`./ocr/${file_name}`)
          if (ocrText.length > 4096) {
            let filename = `ocr-${file_name}.txt`
            fs.writeFileSync(`./ocr/${filename}`, ocrText)
            ctx.deleteMessage(msg.message_id)
            ctx.replyWithDocument({
              source: `./ocr/${filename}`
            }, {
              reply_to_message: ctx.message.message_id
            })
            return fs.unlinkSync(`./ocr/${filename}`)
          } else {
            return ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, ocrText, {
              parse_mode: "HTML"
            })
          }
        }catch(error) {
          return ctx.editMessageText(msg.message_id, undefined, langs.ocrError)
        }
      })
    })
  }catch(error) {
    replyToMessage(ctx, langs.ocrError, false)
    return reportError(error, ctx)
  }
}
export async function ocr(ctx) {
  let langs = await getLang(ctx)
  try {
    if (!ctx.message.reply_to_message) {
      return replyToMessage(ctx, langs.ocrReply, false)
    }
    if (!ctx.message.reply_to_message.photo) {
      return replyToMessage(ctx, langs.ocrReply, false)
    }
    let msg = await replyToMessage(ctx, langs.ocrLoading.replace(/\{langs\}/i, "auto"), false)
    let file_id = ctx.message.reply_to_message.photo[ctx.message.reply_to_message.photo.length -1].file_id
    let url = await ctx.telegram.getFileLink(file_id)
    let file_name = `${Date.now()}.${await path.basename(url.href)}`
    https.get(url, async (res)=> {
      let file = fs.createWriteStream(`./ocr/${file_name}`)
      res.pipe(file)
      file.on("error", async (error)=> {
        return replyToMessage(ctx, langs.ocrError, false)
      })
      file.on("finish", async ()=> {
        try {
          let ocrText = `${langs.ocrSuccess.replace(/\{langs\}/i, "auto")}`
          let data = await ocrSpace(`./ocr/${file_name}`, {
            apiKey: String(process.env.OCR_API)})
          data.ParsedResults.forEach(async (item, index)=> {
            let ParsedText = item.ParsedText || ""
            ocrText += await clearHTML(`\n${ParsedText.trim()}`)
          })
          fs.unlinkSync(`./ocr/${file_name}`)
          if (ocrText.length > 4096) {
            let filename = `ocr-${file_name}.txt`
            fs.writeFileSync(`./ocr/${filename}`, ocrText)
            ctx.deleteMessage(msg.message_id)
            ctx.replyWithDocument({
              source: `./ocr/${filename}`
            }, {
              reply_to_message: ctx.message.message_id
            })
            return fs.unlinkSync(`./ocr/${filename}`)
          } else {
            return ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, ocrText, {
              parse_mode: "HTML"
            })
          }
        }catch(error) {
          return ctx.editMessageText(msg.message_id, undefined, langs.ocrError, {
            parse_mode: "HTML"
          })
        }
      })
    })
  }catch(error) {
    replyToMessage(ctx, langs.ocrError, false)
    return reportError(error, ctx)
  }
}