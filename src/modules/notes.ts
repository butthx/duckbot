import {
  reportError,
  getLang,
  replyToUser,
  buildKeyboard,
  parse,
  isAdmin,
  replyToMessage,
  replyToUserPhoto,
  replyToUserVideo,
  replyToUserVoice,
  replyToUserSticker,
  replyToUserVideoNote,
  replyToUserAudio,
  replyToUserDocument
} from "./misc"
import groups from "./database/groups"
export async function handleNotes (ctx) {
  try {
    if ("message" in ctx.update) {
      let langs = await getLang(ctx)
      let text: any = ctx.message.text || ctx.message.caption || false
      if (text) {
        let data = await groups.findOne({
          chat_id: ctx.chat.id
        })
        if (data !== null) {
          if (!data.notes.status) return
          let list = data.notes.value
          if (list.length >= 1) {
            list.forEach(async (item, index)=> {
              let regex = new RegExp(`#${item.key.replace(/\s+/i, "").trim()}$`, "")
              if (regex.exec(text)) {
                let type = item.type.toLowerCase()
                switch (type) {
                  case "text":
                    let parseJson = JSON.parse(await buildKeyboard(item.value))
                    let keyboard = parseJson.keyboard
                    let md = await parse(ctx, parseJson.text)
                    if (keyboard.length >= 1) {
                      let msg = await   replyToUser(ctx, md, keyboard)
                      return domNotes(ctx, data, msg)
                    } else {
                      let msg = await  replyToUser(ctx, md, false)
                      return domNotes(ctx, data, msg)
                    }
                    break;
                  case "photo":
                    if (item.value) {
                      if (item.caption) {
                        let parse = JSON.parse(await buildKeyboard(item.caption))
                        if (parse.keyboard.length >= 1) {
                          let msg = await  replyToUserPhoto(ctx, item.value, `<code>#${item.key}</code>\n${parse.text}`, parse.keyboard)
                          return domNotes(ctx, data, msg)
                        } else {
                          let msg = await  replyToUserPhoto(ctx, item.value, `<code>#${item.key}</code>\n${parse.text}`)
                          return domNotes(ctx, data, msg)
                        }
                      } else {
                        let msg = await   replyToUserPhoto(ctx, item.value, `<code>#${item.key}</code>`)
                        return domNotes(ctx, data, msg)
                      }
                    }
                    break;
                  case "video":
                    if (item.value) {
                      if (item.caption) {
                        let parse = JSON.parse(await buildKeyboard(item.caption))
                        if (parse.keyboard.length >= 1) {
                          let msg = await  replyToUserVideo(ctx, item.value, `<code>#${item.key}</code>\n${parse.text}`, parse.keyboard)
                          return domNotes(ctx, data, msg)
                        } else {
                          let msg = await  replyToUserVideo(ctx, item.value, `<code>#${item.key}</code>\n${parse.text}`)
                          return domNotes(ctx, data, msg)
                        }
                      } else {
                        let msg = await   replyToUserVideo(ctx, item.value, `<code>#${item.key}</code>`)
                        return domNotes(ctx, data, msg)
                      }
                    }
                    break;
                  case "document":
                    if (item.value) {
                      if (item.caption) {
                        let parse = JSON.parse(await buildKeyboard(item.caption))
                        if (parse.keyboard.length >= 1) {
                          let msg = await  replyToUserDocument(ctx, item.value, `<code>#${item.key}</code>\n${parse.text}`, parse.keyboard)
                          return domNotes(ctx, data, msg)
                        } else {
                          let msg = await  replyToUserDocument(ctx, item.value, `<code>#${item.key}</code>\n${parse.text}`)
                          return domNotes(ctx, data, msg)
                        }
                      } else {
                        let msg = await   replyToUserDocument(ctx, item.value, `<code>#${item.key}</code>`)
                        return domNotes(ctx, data, msg)
                      }
                    }
                    break;
                  case "audio":
                    if (item.value) {
                      if (item.caption) {
                        let parse = JSON.parse(await buildKeyboard(item.caption))
                        if (parse.keyboard.length >= 1) {
                          let msg = await  replyToUserAudio(ctx, item.value, `<code>#${item.key}</code>\n${parse.text}`, parse.keyboard)
                          return domNotes(ctx, data, msg)
                        } else {
                          let msg = await  replyToUserAudio(ctx, item.value, `<code>#${item.key}</code>\n${parse.text}`)
                          return domNotes(ctx, data, msg)
                        }
                      } else {
                        let msg = await   replyToUserAudio(ctx, item.value, `<code>#${item.key}</code>`)
                        return domNotes(ctx, data, msg)
                      }
                    }
                    break;
                  case "voice":
                    if (item.value) {
                      if (item.caption) {
                        let parse = JSON.parse(await buildKeyboard(item.caption))
                        if (parse.keyboard.length >= 1) {
                          let msg = await  replyToUserVoice(ctx, item.value, `<code>#${item.key}</code>\n${parse.text}`, parse.keyboard)
                          return domNotes(ctx, data, msg)
                        } else {
                          let msg = await  replyToUserVoice(ctx, item.value, `<code>#${item.key}</code>\n${parse.text}`)
                          return domNotes(ctx, data, msg)
                        }
                      } else {
                        let msg = await   replyToUserVoice(ctx, item.value, `<code>#${item.key}</code>`)
                        return domNotes(ctx, data, msg)
                      }
                    }
                    break;
                  case "video_note":
                    if (item.value) {
                      let msg = await   replyToUserVideoNote(ctx, item.value)
                      return domNotes(ctx, data, msg)
                    }
                    break;
                  case "sticker":
                    if (item.value) {
                      let msg = await  replyToUserSticker(ctx, item.value)
                      return domNotes(ctx, data, msg)
                    }
                    break;
                  default:
                  }
                }
              })
            }
          }
        }
      }
      return
    }catch(error) {
      return reportError(error,
        ctx)
    }
  }
  export async function saveNotes(ctx) {
    let langs = await getLang(ctx)
    try {
      if (ctx.chat.type == "private") {
        return replyToMessage(ctx, langs.groupsOnly, false)
      }
      let admin = await isAdmin(ctx)
      if (!admin) {
        return replyToMessage(ctx, langs.userNonAdmin, false)
      }
      let text = ctx.message.text
      let spl = text.split(" ")
      let key: any = spl[1] || false
      let data = await groups.findOne({
        chat_id: ctx.chat.id
      })
      if (data == null) {
        return
      }
      if (!key) {
        return replyToMessage(ctx, langs.notesSaveError, false)
      }
      if (!data.notes.status) return
      let index = data.notes.value.findIndex((item)=> item.key == key)
      if (ctx.message.reply_to_message) {
        if (ctx.message.reply_to_message.text) {
          let json = {
            key: String(key),
            type: "text",
            value: String(ctx.message.reply_to_message.text)
          }
          if (index == -1) {
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesSaved.replace(/\{key\}/i, key), false)
          } else {
            data.notes.value.splice(index, 1)
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesUpdate.replace(/\{key\}/i, key), false)
          }
        }
        // photo
        if (ctx.message.reply_to_message.photo) {
          let json = {
            key: String(key),
            type: "photo",
            value: ctx.message.reply_to_message.photo[ctx.message.reply_to_message.photo.length -1].file_id,
            caption: ctx.message.reply_to_message.caption || false
          }
          if (index == -1) {
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesSaved.replace(/\{key\}/i, key), false)
          } else {
            data.notes.value.splice(index, 1)
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesUpdate.replace(/\{key\}/i, key), false)
          }
        }
        //video
        if (ctx.message.reply_to_message.video) {
          let json = {
            key: String(key),
            type: "video",
            value: ctx.message.reply_to_message.video.file_id,
            caption: ctx.message.reply_to_message.caption || false
          }
          if (index == -1) {
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesSaved.replace(/\{key\}/i, key), false)
          } else {
            data.notes.value.splice(index, 1)
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesUpdate.replace(/\{key\}/i, key), false)
          }
        }
        //document
        if (ctx.message.reply_to_message.document) {
          let json = {
            key: String(key),
            type: "document",
            value: ctx.message.reply_to_message.document.file_id,
            caption: ctx.message.reply_to_message.caption || false
          }
          if (index == -1) {
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesSaved.replace(/\{key\}/i, key), false)
          } else {
            data.notes.value.splice(index, 1)
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesUpdate.replace(/\{key\}/i, key), false)
          }
        }
        //sticker
        if (ctx.message.reply_to_message.sticker) {
          let json = {
            key: String(key),
            type: "sticker",
            value: String(ctx.message.reply_to_message.sticker.file_id)
          }
          if (index == -1) {
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesSaved.replace(/\{key\}/i, key), false)
          } else {
            data.notes.value.splice(index, 1)
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesUpdate.replace(/\{key\}/i, key), false)
          }
        }
        //audio
        if (ctx.message.reply_to_message.audio) {
          let json = {
            key: String(key),
            type: "audio",
            value: ctx.message.reply_to_message.audio.file_id,
            caption: ctx.message.reply_to_message.caption || false
          }
          if (index == -1) {
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesSaved.replace(/\{key\}/i, key), false)
          } else {
            data.notes.value.splice(index, 1)
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesUpdate.replace(/\{key\}/i, key), false)
          }
        }
        //video_note
        if (ctx.message.reply_to_message.video_note) {
          let json = {
            key: String(key),
            type: "video_note",
            value: ctx.message.reply_to_message.video_note.file_id
          }
          if (index == -1) {
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesSaved.replace(/\{key\}/i, key), false)
          } else {
            data.notes.value.splice(index, 1)
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesUpdate.replace(/\{key\}/i, key), false)
          }
        }
        //voice
        if (ctx.message.reply_to_message.voice) {
          let json = {
            key: String(key),
            type: "voice",
            value: ctx.message.reply_to_message.voice.file_id,
            caption: ctx.message.reply_to_message.caption || false
          }
          if (index == -1) {
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesSaved.replace(/\{key\}/i, key), false)
          } else {
            data.notes.value.splice(index, 1)
            data.notes.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.notesUpdate.replace(/\{key\}/i, key), false)
          }
        }
      } else {
        let textSplit = ctx.message.text.split(" ")
        textSplit.splice(1, 1).splice(0, 1)
        let json = {
          key: String(key),
          type: "text",
          value: String(textSplit.join(" "))
        }
        if (index == -1) {
          data.notes.value.push(json)
          data = await data.save()
          return replyToMessage(ctx, langs.notesSaved.replace(/\{key\}/i, key), false)
        } else {
          data.notes.value.splice(index, 1)
          data.notes.value.push(json)
          data = await data.save()
          return replyToMessage(ctx, langs.notesUpdate.replace(/\{key\}/i, key), false)
        }
      }
    }catch(error) {
      replyToMessage(ctx, langs.notesSaveError, false)
      return reportError(error, ctx)
    }
  }
  export async function getNotes(ctx) {
    let langs = await getLang(ctx)
    try {
      if (ctx.chat.type == "private") {
        return replyToMessage(ctx, langs.groupsOnly, false)
      }
      let data = await groups.findOne({
        chat_id: ctx.chat.id
      })
      if (data == null) {
        return replyToMessage(ctx, langs.notesNotFound, false)
      }
      if (!data.notes.status) return
      let notes = data.notes.value
      if (notes.length >= 1) {
        let result = langs.notesGet.replace(/\{title\}/i, ctx.chat.title)
        notes.sort()
        notes.forEach((item, index)=> {
          result += `<code>#${item.key}</code> `
        })
        return replyToMessage(ctx, result, false)
      }
      return replyToMessage(ctx, langs.notesNotFound, false)
    }catch(error) {
      replyToMessage(ctx, langs.notesGetError, false)
      return reportError(error, ctx)
    }
  }
  export async function removeNotes(ctx) {
    let langs = await getLang(ctx)
    try {
      if (ctx.chat.type == "private") {
        return replyToMessage(ctx, langs.groupsOnly, false)
      }
      let admin = await isAdmin(ctx)
      if (!admin) {
        return replyToMessage(ctx, langs.userNonAdmin, false)
      }
      let data = await groups.findOne({
        chat_id: ctx.chat.id
      })
      let key: any = ctx.message.text.split(" ")[1] || false
      if (data == null) {
        return replyToMessage(ctx, langs.notesNotFound, false)
      }
      if (!key) {
        return replyToMessage(ctx, langs.notesRmError, false)
      }
      if (!data.notes.status) return
      let notes = data.notes.value
      if (notes.length >= 1) {
        let index = notes.findIndex((el)=> el.key == key)
        if (index !== -1) {
          data.notes.value.splice(index, 1)
          data = await data.save()
          return replyToMessage(ctx, langs.notesRemove.replace(/\{key\}/i, key), false)
        }
      }
      return replyToMessage(ctx, langs.notesNotFound, false)
    }catch(error) {
      replyToMessage(ctx, langs.notesRmError, false)
      return reportError(error, ctx)
    }
  }
  export async function removeNotesAll(ctx) {
    let langs = await getLang(ctx)
    try {
      if (ctx.chat.type == "private") {
        return replyToMessage(ctx, langs.groupsOnly, false)
      }
      let admin = await isAdmin(ctx)
      if (!admin) {
        return replyToMessage(ctx, langs.userNonAdmin, false)
      }
      let data = await groups.findOne({
        chat_id: ctx.chat.id
      })
      if (data == null) {
        return replyToMessage(ctx, langs.notesNotFound, false)
      }
      if (!data.notes.status) return
      let notes = data.notes.value
      if (notes.length >= 1) {
        data.notes.value = new Array()
        data = await data.save()
        return replyToMessage(ctx, langs.notesRmAll, false)
      }
      return replyToMessage(ctx, langs.notesNotFound, false)
    }catch(error) {
      replyToMessage(ctx, langs.notesRmError, false)
      return reportError(error, ctx)
    }
  }
  async function domNotes(ctx, data: any = false, msg: any = false) {
    try {
      if (data) {
        if (msg) {
          let domStatus = data.notes.deleteOldMessage.status
          if (domStatus) {
            try {
              ctx.deleteMessage(data.notes.deleteOldMessage.message_id)
            }catch(error) {}
            data.notes.deleteOldMessage.message_id = msg.message_id
            data = await data.save()
          }
        }
      }
      return;
    }catch(error) {
      return;
    }
  }