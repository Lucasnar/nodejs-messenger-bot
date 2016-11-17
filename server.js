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

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

bot.on('message', (payload, reply) => {
  let message = payload.message.text
  reply({text: 'hey!'}, (err, info) => {})
})

// SERVER
http.createServer(bot.middleware()).listen(process.env.PORT || 5000)
console.log('Echo bot server running at port 5000.')
