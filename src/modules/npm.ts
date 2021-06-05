import axios from 'axios'
import cheerio from 'cheerio'
import { replyToUser, getPing } from './misc'

async function scrapt(query) {
  try {
    let header = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 10; Redmi 5A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
      },
    }
    let baseUrl = `https://www.npmjs.com/search?q=${encodeURI(query)}`
    let html = await axios.get(baseUrl, header)
    if (html.status == 200) {
      let $ = cheerio.load(html.data)
      let result = ''
      $('section').each((i, el) => {
        let num = i + 1
        let item = $(el).find('.items-end').find('a')
        let title = item
          .find('h3')
          .text()
          .replace(/\s\s+/g, '')
          .replace(/\&/gim, '&amp;')
          .replace(/\</gim, '&lt;')
          .replace(/\>/gim, '&gt;')
          .replace(/\"/gim, '&quot;')
        let desc = $(el)
          .find('p')
          .text()
          .replace(/\s\s+/g, '')
          .replace(/\&/gim, '&amp;')
          .replace(/\</gim, '&lt;')
          .replace(/\>/gim, '&gt;')
          .replace(/\"/gim, '&quot;')
        let href = item.attr('href')
        let version = $(el)
          .find('span')
          .text()
          .replace(/(\s\s+)|(exact match)/gi, '')
          .replace(/\&/gim, '&amp;')
          .replace(/\</gim, '&lt;')
          .replace(/\>/gim, '&gt;')
          .replace(/\"/gim, '&quot;')
        result += `${num}. <a href="https://npmjs.com${href}">${title}</a>\n   <b>${desc}</b>\n   <i>${version}</i>\n   <code>npm i ${title}</code>\n`
      })
      return {
        text: result,
        base: baseUrl,
      }
    }
    return false
  } catch (error) {
    return false
  }
}

export async function npm(ctx) {
  try {
    let c = await getPing(ctx)
    let spl = ctx.message.text.split(' ')
    spl.splice(0, 1)
    if (spl.length == 0) return
    let msg = await replyToUser(
      ctx,
      `Searching..\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`
    )
    let data = await scrapt(spl.join(' '))
    if (!data)
      return ctx.telegram.editMessageText(
        msg.chat.id,
        msg.message_id,
        undefined,
        `Not Found!\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`
      )
    return ctx.telegram.editMessageText(
      msg.chat.id,
      msg.message_id,
      undefined,
      `${data.text}\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Website`,
                url: data.base,
                hide: true,
              },
            ],
          ],
        },
        disable_web_page_preview: true,
      }
    )
  } catch (error) {
    return error
  }
}

export async function npmInline(ctx) {
  try {
    let spl = ctx.update.inline_query.query.split(' ')
    spl.splice(0, 1)
    if (spl.length == 0) return
    let data = await scrapt(spl.join(' '))
    if (!data) return
    return ctx.answerInlineQuery([
      {
        type: 'article',
        id: ctx.update.inline_query.id,
        title: 'Result',
        description: `Result for ${spl.join(' ')}`,
        input_message_content: {
          message_text: data.text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        },
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Website`,
                url: data.base,
                hide: true,
              },
            ],
          ],
        },
      },
    ])
  } catch (error) {
    return error
  }
}
