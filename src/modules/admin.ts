import {replyToMessage,isAdmin,getLang,reportError} from "./misc"
import groups from "./database/groups"
import {Markup} from "telegraf"
export async function adminCache(ctx){
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
    if(data !== null){
      let date = new Date(data.dateAdmin)
      let now = new Date(Date.now())
      let abs = Math.abs(now.getMinutes() - date.getMinutes())
      if(now.getFullYear() > date.getFullYear()){
        data.admins = await ctx.getChatAdministrators()
        data.dateAdmin = Date.now()
        data = await data.save()
        return replyToMessage(ctx,langs.adminCacheSuccess,false)
      }
      if(now.getMonth() > date.getMonth()){
        data.admins = await ctx.getChatAdministrators()
        data.dateAdmin = Date.now()
        data = await data.save()
        return replyToMessage(ctx,langs.adminCacheSuccess,false)
      }
      if(now.getDay() > date.getDay()){
        data.admins = await ctx.getChatAdministrators()
        data.dateAdmin = Date.now()
        data = await data.save()
        return replyToMessage(ctx,langs.adminCacheSuccess,false)
      }
      if(now.getHours() > date.getHours()){
        data.admins = await ctx.getChatAdministrators()
        data.dateAdmin = Date.now()
        data = await data.save()
        return replyToMessage(ctx,langs.adminCacheSuccess,false)
      }
      if(abs >= 10){
        data.admins = await ctx.getChatAdministrators()
        data.dateAdmin = Date.now()
        data = await data.save()
        return replyToMessage(ctx,langs.adminCacheSuccess,false)
      }
    }
    return replyToMessage(ctx,langs.adminCacheFailed,false)
  }catch(error){
    replyToMessage(ctx,langs.adminCacheFailed,false)
    return reportError(error,ctx)
  }
}
export async function settings(ctx){
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
    if(data !== null){
      let json = {
        "true" : "Enable",
        "false" : "Disable"
      }
      let keyboard = [
         [{
           text : "WELCOME",
           callback_data : "welcome drdn",
           hide : true
         }],
         [{
           text : "GOODBYE",
           callback_data : "goodbye drdn",
           hide : true
         }],
         [{
           text : "NOTES",
           callback_data : "notes drdn",
           hide : true
         }],
         [{
           text : "FILTERS",
           callback_data : "filters drdn",
           hide : true
         }],
         [{
           text : "DMATA",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.duckbotmata)],
           callback_data : `set duckbotmata ${!data.duckbotmata}`,
           hide : true
         }],
         [{
           text : "DAS",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.das)],
           callback_data : `set das ${!data.das}`,
           hide : true
         }],
         [{
           text : "CLEN",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.cleanEvent)],
           callback_data : `set cleanevent ${!data.cleanEvent}`,
           hide : true
         }]
        ]
      return replyToMessage(ctx,"<b>Settings Avalible :</b>\n\nDOM : deleteOldMessage\nCPH : captcha\nDMATA : Duckbot Mata\nDAS : Duckbot Anti Spam\nCLEN : Clean Event",keyboard)
    }
  }catch(error){
    return reportError(error,ctx)
  }
}
/*let data = await groups.findOne({chat_id:ctx.chat.id})
    if(data !== null){
      let json = {
        "true" : "Enable",
        "false" : "Disable"
      }
      let keyboard = [
         [{
           text : "WELCOME",
           callback_data : "welcome drdn",
           hide : true
         },{
           text : json[String(data.welcome.status)],
           callback_data : `set welcome ${!data.welcome.status}`,
           hide : true
         }],
         [{
           text : "└",
           callback_data : "text",
           hide : true
         },{
           text : "DOM",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.welcome.deleteOldMessage.status)],
           callback_data : `set welcome-dom ${!data.welcome.deleteOldMessage.status}`,
           hide : true
         }],
         [{
           text : "└",
           callback_data : "text",
           hide : true
         },{
           text : "CPH",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.welcome.captcha.status)],
           callback_data : `set captcha ${!data.welcome.captcha.status}`,
           hide : true
         }],
         [{
           text : "GOODBYE",
           callback_data : "goodbye drdn",
           hide : true
         },{
           text : json[String(data.goodbye.status)],
           callback_data : `set goodbye ${!data.goodbye.status}`,
           hide : true
         }],
         [{
           text : "└",
           callback_data : "text",
           hide : true
         },{
           text : "DOM",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.goodbye.deleteOldMessage.status)],
           callback_data : `set goodbye-dom ${!data.goodbye.deleteOldMessage.status}`,
           hide : true
         }],
         [{
           text : "NOTES",
           callback_data : "notes drdn",
           hide : true
         }],
         [{
           text : "└",
           callback_data : "text",
           hide : true
         },{
           text : "DOM",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.notes.deleteOldMessage.status)],
           callback_data : `set notes-dom ${!data.notes.deleteOldMessage.status}`,
           hide : true
         }],
         [{
           text : "FILTERS",
           callback_data : "filters drdn",
           hide : true
         }],
         [{
           text : "└",
           callback_data : "text",
           hide : true
         },{
           text : "DOM",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.filters.deleteOldMessage.status)],
           callback_data : `set filters-dom ${!data.filters.deleteOldMessage.status}`,
           hide : true
         }],
         [{
           text : "DMATA",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.duckbotmata)],
           callback_data : `set duckbotmata ${!data.duckbotmata}`,
           hide : true
         }],
         [{
           text : "DAS",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.das)],
           callback_data : `set das ${!data.das}`,
           hide : true
         }],
         [{
           text : "CLEN",
           callback_data : "text",
           hide : true
         },{
           text : json[String(data.cleanEvent)],
           callback_data : `set cleanevent ${!data.cleanEvent}`,
           hide : true
         }]
        ]*/