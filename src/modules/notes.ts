import {reportError,getLang,replyToUser,buildKeyboard,parse,isAdmin,replyToMessage} from "./misc"
import groups from "./database/groups"
export async function handleNotes (ctx){
  try{
    if("message" in ctx.update){
      let langs = await getLang(ctx)
      let text:any = ctx.message.text || ctx.message.caption || false
      let entities = ctx.message.entities || ctx.message.caption_entities || false
      if(!entities){
        return;
      }
      if(text){
       let data = await groups.findOne({chat_id:ctx.chat.id})
       if(data !== null){
         let list = data.notes.value
         if(list.length >= 1){
           entities.forEach(async(el,i)=>{
             if(el.type.toLowerCase() == "hashtag"){
               let enText = text.substr(el.offset,el.length)
               list.forEach(async (item,index)=>{
                 let regex = new RegExp(`#${item.key.replace(/\s+/i,"").trim()}$`,"i")
                 if(regex.exec(enText)){
                   let type = item.type.toLowerCase()
                   switch(type){
                     case "text":
                       let parseJson = JSON.parse(await buildKeyboard(item.value))
                       let keyboard = parseJson.keyboard
                       let md = await parse(ctx,parseJson.text)
                       if(keyboard.length >= 1){
                         return replyToUser(ctx,md,keyboard)
                       }else{
                         return replyToUser(ctx,md,false)
                       }
                       break;
                     default:
                   }
                 }
               })
             }
           })
         }
       }
      }
    }
    return
  }catch(error){
    return reportError(error,ctx)
  }
}
export async function saveNotes(ctx){
  let langs = await getLang(ctx)
  try{
    if(ctx.chat.type == "private"){
      return replyToMessage(ctx,langs.groupsOnly,false)
    }
    let admin = await isAdmin(ctx)
    if(!admin){
      return replyToMessage(ctx,langs.userNonAdmin,false)
    }
    let text = ctx.message.text
    let spl = text.split(" ")
    let key:any = spl[1] || false
    let data = await groups.findOne({chat_id:ctx.chat.id})
    if(data == null){
      return
    }
    if(!key){
      return replyToMessage(ctx,langs.notesSaveError,false)
    }
    let index =  data.notes.value.findIndex((item)=> item.key == key)
    if(ctx.message.reply_to_message){
      if(ctx.message.reply_to_message.text){
       let json = {
         key : String(key),
         type : "text",
         value : String(ctx.message.reply_to_message.text)
       }
       if(index == -1){
         data.notes.value.push(json)
         data = await data.save()
         return replyToMessage(ctx,langs.notesSaved.replace(/\{key\}/i,key),false)
       }else{
         data.notes.value.splice(index,1)
         data.notes.value.push(json)
         data = await data.save()
         return replyToMessage(ctx,langs.notesUpdate.replace(/\{key\}/i,key),false)
       }
      }
      /*if(ctx.message.reply_to_message.photo){
        
      }
      if(ctx.message.reply_to_message.video){
        
      }
      if(ctx.message.reply_to_message.document){
        
      }
      if(ctx.message.reply_to_message.sticker){
        
      }
      if(ctx.message.reply_to_message.audio){
        
      }
      if(ctx.message.reply_to_message.video_note){
        
      }
      if(ctx.message.reply_to_message.voice){
        
      }*/
    }
  }catch(error){
    replyToMessage(ctx,langs.notesSaveError,false)
    return reportError(error,ctx)
  }
}
export async function getNotes(ctx){
  let langs = await getLang(ctx)
  try{
    if(ctx.chat.type == "private"){
      return replyToMessage(ctx,langs.groupsOnly,false)
    }
    let data = await groups.findOne({chat_id:ctx.chat.id})
    if(data == null){
      return replyToMessage(ctx,langs.notesNotFound,false)
    }
    let notes = data.notes.value
    if(notes.length >= 1){
      let result = langs.notesGet.replace(/\{title\}/i,ctx.chat.title)
      notes.sort()
      notes.forEach((item,index)=>{
        result += `<code>#${item.key}</code> `
      })
      return replyToMessage(ctx,result,false)
    }
    return replyToMessage(ctx,langs.notesNotFound,false)
  }catch(error){
    replyToMessage(ctx,langs.notesGetError,false)
    return reportError(error,ctx)
  }
}
export async function removeNotes(ctx){
  let langs = await getLang(ctx)
  try{
    if(ctx.chat.type == "private"){
      return replyToMessage(ctx,langs.groupsOnly,false)
    }
    let admin = await isAdmin(ctx)
    if(!admin){
      return replyToMessage(ctx,langs.userNonAdmin,false)
    }
    let data = await groups.findOne({chat_id:ctx.chat.id})
    let key:any = ctx.message.text.split(" ")[1] || false
    if(data == null){
      return replyToMessage(ctx,langs.notesNotFound,false)
    }
    if(!key){
      return replyToMessage(ctx,langs.notesRmError,false)
    }
    let notes = data.notes.value
    if(notes.length >= 1){
      let index = notes.findIndex((el)=> el.key == key)
      if(index !== -1){
        data.notes.value.splice(index,1)
        data = await data.save()
        return replyToMessage(ctx,langs.notesRemove.replace(/\{key\}/i,key),false)
      }
    }
    return replyToMessage(ctx,langs.notesNotFound,false)
  }catch(error){
    replyToMessage(ctx,langs.notesRmError,false)
    return reportError(error,ctx)
  }
}
export async function removeNotesAll(ctx){
  let langs = await getLang(ctx)
  try{
    if(ctx.chat.type == "private"){
      return replyToMessage(ctx,langs.groupsOnly,false)
    }
    let admin = await isAdmin(ctx)
    if(!admin){
      return replyToMessage(ctx,langs.userNonAdmin,false)
    }
    let data = await groups.findOne({chat_id:ctx.chat.id})
    if(data == null){
      return replyToMessage(ctx,langs.notesNotFound,false)
    }
    let notes = data.notes.value
    if(notes.length >= 1){
      data.notes.value = new Array()
      data = await data.save()
      return replyToMessage(ctx,langs.notesRmAll,false)
    }
    return replyToMessage(ctx,langs.notesNotFound,false)
  }catch(error){
    replyToMessage(ctx,langs.notesRmError,false)
    return reportError(error,ctx)
  }
}