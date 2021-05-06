import axios from "axios"
import cheerio from "cheerio"
import {replyToUser} from "./misc"

async function scrapt(query){
  try{
  let header = { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36' }}
    let baseUrl = `https://www.npmjs.com/search?q=${encodeURI(query)}`
    let html = await axios.get(baseUrl,header)
    if(html.status == 200){
      let $ = cheerio.load(html.data)
      let result = ""
      $("section").each(async (i,el)=>{
        let num = i+1
        let item = $(el).find(".items-end").find("a")
        let title = item.find("h3").text().replace(/\s\s+/g, '');
        let desc = $(el).find("p").text().replace(/\s\s+/g, '');
        let href = item.attr("href")
        let version = $(el).find("span").text().replace(/(\s\s+)|(exact match)/gi, '');
        result += `${num}. <a href="https://npmjs.com${href}">${title}</a>\n   <b>${desc}</b>\n   <i>${version}</i>\n   <code>npm i ${title}</code>\n`
      })
      return {text:result,base:baseUrl}
    }
    return false
  }catch(error){
    return false
  }
}

export async function npm(ctx){
  try{
    let spl = ctx.message.text.split(" ")
    spl.splice(0,1)
    if(spl.length == 0) return
    let msg = await replyToUser(ctx,`Searching..`)
    let data = await scrapt(spl.join(" "))
    if(!data) return ctx.telegram.editMessageText(msg.chat.id,msg.message_id, undefined,`Not Found!`)
    return ctx.telegram.editMessageText(msg.chat.id,msg.message_id,undefined,data.text,{
      parse_mode : "HTML",
      reply_markup : {
        inline_keyboard : [[{text:`Website`,url:data.base,hide:true}]]
      },
      disable_web_page_preview : true
    })
  }catch(error){
    return error
  }
}

export async function npmInline(ctx){
  try{
    let spl = ctx.update.inline_query.query.split(" ")
    spl.splice(0,1)
    if(spl.length == 0) return
    let data = await scrapt(spl.join(" "))
    if(!data) return
    return ctx.answerInlineQuery([{
      type : "article",
      id : ctx.update.inline_query.id,
      title : "Result",
      description : `Result for ${spl.join(" ")}`,
      input_message_content : {
        message_text : data.text,
        parse_mode : "HTML",
        disable_web_page_preview : true
      },
      reply_markup : {
        inline_keyboard : [[{text:`Website`,url:data.base,hide:true}]]
      }
    }])
  }catch(error){
    return error
  }
}

export async function pypiScrapt(query){
  try{
    let data = await axios.get(`https://pypi.org/search/?q=${encodeURI(query)}`)
    if(data.status == 200){
      let result = ``
      let $ = cheerio.load(data.data)
      $(".unstyled").each((i,el)=>{
        console.log(i)
        /*let href = $(el).find("li").find(".package-snippet").attr("href")
        let title = $(el).find("li").find(".package-snippet__title").find(".package-snippet__name").text().replace(/\s\s+/g, '');
        let version = $(el).find("li").find(".package-snippet__title").find(".package-snippet__version").text().replace(/\s\s+/g, '');
        let date = $(el).find("li").find(".package-snippet__title").find(".package-snippet__released").text().replace(/\s\s+/g, '');
        let desc = $(el).find("li").find(".package-snippet__description").text().replace(/\s\s+/g, '');
        result += `<a href="https://pypi.org${href}">${title}</a>\n    <b>${desc}</b>\n    <i>${version} • ${date}</i>\n`*/
      })
      console.log(result)
    }
    return false
  }catch(error){
    return false
  }
}

export async function pypi(ctx){
  try{
    let text = ctx.message.text.split(" ")
    text.splice(0,1)
    if(text.length == 0) return
    text = text.join(" ")
    return pypiScrapt(text)
  }catch(error){
    return error
  }
}