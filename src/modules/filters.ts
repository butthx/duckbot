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
export async function handleFilters(ctx) {
  try {
    if ("message" in ctx.update) {
      let langs = await getLang(ctx)
      let text: any = ctx.message.text || ctx.message.caption || false
      if (text) {
        let data = await groups.findOne({
          chat_id: ctx.chat.id
        })
        if (data !== null) {
          if (!data.more.filters.status) return
          let list = data.more.filters.value
          if (list.length >= 1) {
            list.forEach(async (item, index)=> {
              let regex = new RegExp(item.key, "gmi")
              if (regex.exec(text)) {
                let type = item.type.toLowerCase()
                switch (type) {
                  case "text":
                    let parseJson = JSON.parse(await buildKeyboard(item.value))
                    let keyboard = parseJson.keyboard
                    let md = await parse(ctx, parseJson.text)
                    if (keyboard.length >= 1) {
                      let msg = await  await   replyToUser(ctx, md, keyboard)
                      return domFilters(ctx, data, msg)
                    } else {
                      let msg = await  await  replyToUser(ctx, md, false)
                      return domFilters(ctx, data, msg)
                    }
                    break;
                  case "photo":
                    if (item.value) {
                      if (item.caption) {
                        let parse = JSON.parse(await buildKeyboard(item.caption))
                        if (parse.keyboard.length >= 1) {
                          let msg = await  await  replyToUserPhoto(ctx, item.value, parse.text, parse.keyboard)
                          return domFilters(ctx, data, msg)
                        } else {
                          let msg = await  await  replyToUserPhoto(ctx, item.value, parse.text)
                          return domFilters(ctx, data, msg)
                        }
                      } else {
                        let msg = await  await   replyToUserPhoto(ctx, item.value)
                        return domFilters(ctx, data, msg)
                      }
                    }
                    break;
                  case "video":
                    if (item.value) {
                      if (item.caption) {
                        let parse = JSON.parse(await buildKeyboard(item.caption))
                        if (parse.keyboard.length >= 1) {
                          let msg = await  await  replyToUserVideo(ctx, item.value, parse.text, parse.keyboard)
                          return domFilters(ctx, data, msg)
                        } else {
                          let msg = await  replyToUserVideo(ctx, item.value, parse.text)
                          return domFilters(ctx, data, msg)
                        }
                      } else {
                        let msg = await   replyToUserVideo(ctx, item.value)
                        return domFilters(ctx, data, msg)
                      }
                    }
                    break;
                  case "document":
                    if (item.value) {
                      if (item.caption) {
                        let parse = JSON.parse(await buildKeyboard(item.caption))
                        if (parse.keyboard.length >= 1) {
                          let msg = await  replyToUserDocument(ctx, item.value, parse.text, parse.keyboard)
                          return domFilters(ctx, data, msg)
                        } else {
                          let msg = await  replyToUserDocument(ctx, item.value, parse.text)
                          return domFilters(ctx, data, msg)
                        }
                      } else {
                        let msg = await   replyToUserDocument(ctx, item.value)
                        return domFilters(ctx, data, msg)
                      }
                    }
                    break;
                  case "audio":
                    if (item.value) {
                      if (item.caption) {
                        let parse = JSON.parse(await buildKeyboard(item.caption))
                        if (parse.keyboard.length >= 1) {
                          let msg = await  replyToUserAudio(ctx, item.value, parse.text, parse.keyboard)
                          return domFilters(ctx, data, msg)
                        } else {
                          let msg = await  replyToUserAudio(ctx, item.value, parse.text)
                          return domFilters(ctx, data, msg)
                        }
                      } else {
                        let msg = await   replyToUserAudio(ctx, item.value)
                        return domFilters(ctx, data, msg)
                      }
                    }
                    break;
                  case "voice":
                    if (item.value) {
                      if (item.caption) {
                        let parse = JSON.parse(await buildKeyboard(item.caption))
                        if (parse.keyboard.length >= 1) {
                          let msg = await  replyToUserVoice(ctx, item.value, parse.text, parse.keyboard)
                          return domFilters(ctx, data, msg)
                        } else {
                          let msg = await  replyToUserVoice(ctx, item.value, parse.text)
                          return domFilters(ctx, data, msg)
                        }
                      } else {
                        let msg = await   replyToUserVoice(ctx, item.value)
                        return domFilters(ctx, data, msg)
                      }
                    }
                    break;
                  case "video_note":
                    if (item.value) {
                      let msg = await   replyToUserVideoNote(ctx, item.value)
                      return domFilters(ctx, data, msg)
                    }
                    break;
                  case "sticker":
                    if (item.value) {
                      let msg = await  await replyToUserSticker(ctx, item.value)
                      return domFilters(ctx, data, msg)
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
  export async function saveFilters(ctx) {
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
      let key = text.split(" ")
      key.splice(0, 1)
      key = key.join(" ")
      let data = await groups.findOne({
        chat_id: ctx.chat.id
      })
      if (data == null) {
        return
      }
      if (!key) {
        return replyToMessage(ctx, langs.filtersSaveError, false)
      }
      if (!data.more.filters.status) return
      let index = data.more.filters.value.findIndex((item)=> item.key == key)
      if (ctx.message.reply_to_message) {
        if (ctx.message.reply_to_message.text) {
          let json = {
            key: String(key),
            type: "text",
            value: String(ctx.message.reply_to_message.text)
          }
          if (index == -1) {
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersSaved.replace(/\{key\}/i, key), false)
          } else {
            data.more.filters.value.splice(index, 1)
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersUpdate.replace(/\{key\}/i, key), false)
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
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersSaved.replace(/\{key\}/i, key), false)
          } else {
            data.more.filters.value.splice(index, 1)
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersUpdate.replace(/\{key\}/i, key), false)
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
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersSaved.replace(/\{key\}/i, key), false)
          } else {
            data.more.filters.value.splice(index, 1)
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersUpdate.replace(/\{key\}/i, key), false)
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
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersSaved.replace(/\{key\}/i, key), false)
          } else {
            data.more.filters.value.splice(index, 1)
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersUpdate.replace(/\{key\}/i, key), false)
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
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersSaved.replace(/\{key\}/i, key), false)
          } else {
            data.more.filters.value.splice(index, 1)
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersUpdate.replace(/\{key\}/i, key), false)
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
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersSaved.replace(/\{key\}/i, key), false)
          } else {
            data.more.filters.value.splice(index, 1)
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersUpdate.replace(/\{key\}/i, key), false)
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
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersSaved.replace(/\{key\}/i, key), false)
          } else {
            data.more.filters.value.splice(index, 1)
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersUpdate.replace(/\{key\}/i, key), false)
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
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersSaved.replace(/\{key\}/i, key), false)
          } else {
            data.more.filters.value.splice(index, 1)
            data.more.filters.value.push(json)
            data = await data.save()
            return replyToMessage(ctx, langs.filtersUpdate.replace(/\{key\}/i, key), false)
          }
        }
      } else {
        key = ctx.message.text.split(" ")[1]
        let valueText = ctx.message.text.split(" ") || false
        if (valueText) {
          valueText.splice(1, 1)
          valueText.splice(0, 1)
          valueText = valueText.join(" ")
        } else {
          valueText = "undefined"
        }
        let json = {
          key: String(key),
          type: "text",
          value: String(valueText)
        }
        if (index == -1) {
          data.more.filters.value.push(json)
          data = await data.save()
          return replyToMessage(ctx, langs.filtersSaved.replace(/\{key\}/i, key), false)
        } else {
          data.more.filters.value.splice(index, 1)
          data.more.filters.value.push(json)
          data = await data.save()
          return replyToMessage(ctx, langs.filtersUpdate.replace(/\{key\}/i, key), false)
        }
      }
    }catch(error) {
      replyToMessage(ctx, langs.filtersSaveError, false)
      return reportError(error, ctx)
    }
  }
  export async function getFilters(ctx) {
    let langs = await getLang(ctx)
    try {
      if (ctx.chat.type == "private") {
        return replyToMessage(ctx, langs.groupsOnly, false)
      }
      let data = await groups.findOne({
        chat_id: ctx.chat.id
      })
      if (data == null) {
        return replyToMessage(ctx, langs.filtersNotFound, false)
      }
      if (!data.more.filters.status) return
      let filters = data.more.filters.value
      if (filters.length >= 1) {
        let result = langs.filtersGet.replace(/\{title\}/i, ctx.chat.title)
        filters.sort()
        filters.forEach((item, index)=> {
          result += `<code>${item.key}</code>\n`
        })
        return replyToMessage(ctx, result, false)
      }
      return replyToMessage(ctx, langs.filtersNotFound, false)
    }catch(error) {
      replyToMessage(ctx, langs.filtersGetError, false)
      return reportError(error, ctx)
    }
  }
  export async function removeFilters(ctx) {
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
      let key: any = ctx.message.text.split(" ") || false
      if (data == null) {
        return replyToMessage(ctx, langs.filtersNotFound, false)
      }
      if (!key) {
        return replyToMessage(ctx, langs.filtersRmError, false)
      }
      key.splice(0, 1)
      key = key.join(" ")
      if (!data.more.filters.status) return
      let filters = data.more.filters.value
      if (filters.length >= 1) {
        let index = filters.findIndex((el)=> el.key == key)
        if (index !== -1) {
          data.more.filters.value.splice(index, 1)
          data = await data.save()
          return replyToMessage(ctx, langs.filtersRemove.replace(/\{key\}/i, key), false)
        }
      }
      return replyToMessage(ctx, langs.filtersNotFound, false)
    }catch(error) {
      replyToMessage(ctx, langs.filtersRmError, false)
      return reportError(error, ctx)
    }
  }
  export async function removeFiltersAll(ctx) {
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
        return replyToMessage(ctx, langs.filtersNotFound, false)
      }
      if (!data.more.filters.status) return
      let filters = data.more.filters.value
      if (filters.length >= 1) {
        data.more.filters.value = new Array()
        data = await data.save()
        return replyToMessage(ctx, langs.filtersRmAll, false)
      }
      return replyToMessage(ctx, langs.filtersNotFound, false)
    }catch(error) {
      replyToMessage(ctx, langs.filtersRmError, false)
      return reportError(error, ctx)
    }
  }
  async function domFilters(ctx, data: any = false, msg: any = false) {
    try {
      if (data) {
        if (msg) {
          let domStatus = data.more.filters.deleteOldMessage.status
          if (domStatus) {
            try {
              ctx.deleteMessage(data.more.filters.deleteOldMessage.message_id)
            }catch(error) {}
            data.more.filters.deleteOldMessage.message_id = msg.message_id
            data = await data.save()
          }
        }
      }
      return;
    }catch(error) {
      return;
    }
  }