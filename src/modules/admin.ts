import {replyToMessage,isAdmin,getLang,reportError} from "./misc"
import groups from "./database/groups"
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
      let date = new Date(Number(data.dateAdmin))
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