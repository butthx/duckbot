import {npmInline} from "./npm"

export async function inline_query(ctx){
  try{
    let command = ctx.update.inline_query.query.split(" ")
    if(String(command[0]).toLowerCase() == "npm"){
      return npmInline(ctx)
    }
    return;
  }catch(error){
    return error
  }
}