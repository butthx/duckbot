## Overview
Hi. This is the repository of my bot (Miss_duckbot). This bot is written in typescript and then compiled into javascript.
## License
**MIT LICENSE**
## Command 
- `/start` - starting bot
- `/setlang` - setting current language
- `/ocrts` - tesseractjs ocr
- `/ocr` - ocr space
- `/tr` - translate text  
and any more.
## Features
- OCR
- Translate
- Duckbot Mata
- Anti Spam
- Kick,ban,mute  
and any more.
## Docs 
Available on [https://butthx.now.sh/duckbot](https://butthx.now.sh/duckbot)
## Deploy 
- `git clone https://github.com/butthx/duckbot`
- `cd duckbot`
- `npm i -g yarn` _opsional if you don't have yarn_ 
- `yarn install`
- `touch .env` 
fill `.env` file with [env value](#env)
- `yarn build`
- `yarn start`  

To update all `dependencies` you can use `yarn upgrade`

[![replit deploy](https://camo.githubusercontent.com/34fe397bff4498f3cc17458b9c76f87687ffe300aec7291eea4d468551bcbabe/68747470733a2f2f7265706c2e69742f62616467652f6769746875622f7265706c69742f64617461626173652d6e6f6465)](https://repl.it/github/butthx/duckbot)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/butthx/duckbot)

## Env
`BOT_TOKEN` : Token bot from bot father.  
`MONGGODB` : Mongoodb URI to connect database.  
`SPAMWATCH_TOKEN` : Api key from spam watch.  
`OCR_API` : OCR space api key.  
`ERROR_LOG` : Channel/Groups/ID to report error.  
`WEBHOOK` : _opsional_. If you add it to the .env file then the bot will run in webhook mode. Otherwise it will run in polling mode. `WEBHOOK : true`. Notes : All value from `WEBHOOK` env will be `true`.

## Contribution
You can submit a pull request or an opened issue.
  

[![corwdin](https://img.shields.io/badge/Translate%20This%20Bot-success.svg?style=flat-square&logo=crowdin)](https://crowdin.com/project/missduckbot)