'use strict'
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: process.env.PAGE_TOKEN, 
  verify: process.env.VERIFY_TOKEN 
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text
  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err
    console.log(`Message received from ${profile.first_name} ${profile.last_name}: ${text}`)
  })
})

bot.on('message', (payload, reply) => {
  let message = payload.message.text


  switch(message){
    case 'ola companheiro':
      let element = {
        title: 'Olaaaaar, companheiro!',
        subtitle: 'Vamos fazer uma greve, companheiro!',
        image_url: 'http://multimidia.gazetadopovo.com.br/media/info/2016/201602/lula-timeline/lula-8.jpg',
        buttons: []
      }

      element.buttons.push({
        type: 'web_url',
        title: 'Procure por mim',
        url: `https://google.com/search?q=Lula`
      })

      reply({
        attachment: {
          type: 'template', 
          payload: {
            template_type: 'generic',
            elements: [element]
          }
        }
      })
      break;
  }
  
  //reply({text: 'hey!'}, (err, info) => {})
})

// SERVER
http.createServer(bot.middleware()).listen(process.env.PORT || 5000)
console.log('Echo bot server running at port 5000.')
