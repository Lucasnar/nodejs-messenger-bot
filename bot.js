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
  let image_url_array = [
    'http://i.huffpost.com/gen/4393364/images/o-EDUARDO-CUNHA-facebook.jpg',
    'http://odincompimenta.com.br/wp-content/uploads/2015/04/4449596-8450628728-25353.jpg',
    'https://s-media-cache-ak0.pinimg.com/originals/32/81/5b/32815b802e029bed7f2b7f0573f7f13a.jpg',
    'http://68.media.tumblr.com/432b187de3ac092dc813f3ca317ec5c4/tumblr_nmk4iz4Ebf1qksk74o1_400.gif'
  ]


  switch(message.toLowerCase()){
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
    case 'manda ibagens':
      for(let i = 0, l = image_url_array.length; i<l; ++i){
        reply({
          attachment: {
            type: 'image',
            payload: {
              url: image_url_array[i]
            }
          }
        })
      }
      break;
    case 'manda ibagens horizontal':
      var my_elements = []
      for(let i = 0, l = image_url_array.length; i<l; ++i){
        my_elements.push({
          title: 'TESTEZINHO',
          subtitle: 'SUPAAA TESTE',
          item_url: 'google.com',
          image_url: image_url_array[i],
          buttons: [{
            type: 'web_url',
            title: 'example',
            url: 'example.com'
          }]
        })
      }
      //console.log(my_elements[0])

      reply({
        attachment: {
          type: 'template', 
          payload: {
            template_type: 'generic',
            elements: my_elements
          }
        }
      })
      //console.log('here')

      break;
  }
})

// SERVER
http.createServer(bot.middleware()).listen(process.env.PORT || 5000)
console.log('Echo bot server running at port 5000.')
