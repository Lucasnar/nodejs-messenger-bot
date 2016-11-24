# Simple test bot for Facebok Messenger

This is a simple bot made for Facebook Messenger. I am just playing with it to learn more about the Facebook API.
I am using NodeJS and the following client to access the API: https://github.com/remixz/messenger-bot.

I intend to post a short tutorial on how to run this app (and any Facebook app) soon.

## How to build a Facebook Messenger bot

### First things first.
* You gotta have a [Facebook] (facebook.com) account.
* Create a [Facebook App] (https://developers.facebook.com/apps).
* Create a [FacebookPage] (https://www.facebook.com/pages/create).
* We're programming this example using NodeJS, so [install it] (https://nodejs.org/en/).
* You'll need to setup a webhook so that Facebook can send you conversation updates and you
can ~hopefully~ do something useful with it (and respond back). There are a fews ways to setup
this endpoint. I am going to show here how to do that both locally, using ngrok, and remotely,
using Heroku. Feel free to use any other server/system you might want to. This part of the
tutorial is intended for begginners (like me) who may have trouble understanding how this
webhook thing works and how to setup one. So, if you want help with this, do the
following optional part.
Optional:
* To test your changes locally while developing, I recommend:
  * Download [ngrok] (https://ngrok.com/).
* To have your bot available in the cloud (working even if you shutdown your computer),
an awesome and free service is Heroku.
  * Create a [Heroku] (https://www.heroku.com/) account.
  * Download and install the [Heroku Command Line Interface] (https://devcenter.heroku.com/articles/heroku-command-line).

### Creating a new project

* Create a new directory where you want your bot to be and initialize a new NodeJS project:
  ```
  $ mkdir my_first_messenger_bot
  $ cd my_first_messenger_bot
  $ npm init
  ```
  * You will be asked to give information about your project in order to populate an important file named package.json.
  * If you don't know what information to give, you can press enter to accept the default in most prompts.
  * Your package.json file will look something like this:

  ```json
  {
    "name": "my_first_messenger_bot",
    "version": "1.0.0",
    "description": "This is my first messenger bot!",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC"
  }
  ```

* In the "scripts" session of the file, add the following line:
  `"start": "node bot.js" `
  * If you don't do this, by default npm will look for a file named "server.js" to start your app.
* For this simple example bot, you can erase the line `"main": "index.js",`.
* Now your package.json should look like this:

```json
{
  "name": "my_first_messenger_bot",
    "version": "1.0.0",
    "description": "This is my first messenger bot!",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "node bot.js"
    },
    "author": "",
    "license": "ISC"
}
```

* Install the package `messenger-bot`:

`$ npm install messenger-bot --save`

* Install everything that may be missing:

`$ npm install`

### Coding the bot

* Create a file named `bot.js` and open it.
* Add the following to your `bot.js`:

```javascript
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

// SERVER
http.createServer(bot.middleware()).listen(3000)
console.log('Echo bot server running at port 3000.')
```
> Example borrowed from https://github.com/remixz/messenger-bot/blob/master/example/echo.js

### Setting up the Page Token and the Verify Token

The bot still needs some settings to work. You have to provide it a page token and a verify token.

Back to Facebook:
* Go to your App Dashboard, click "Add Product" and chose "Messenger."
* Get a token under the "Token Generation" section.
* The `process.env.PAGE_TOKEN` and the `process.env.VERIFY_TOKEN` mean that Node will look for the "PAGE_TOKEN"
and the "VERIFY_TOKEN" variables from the enviroment variables.
  * To set an enviroment variable in Unix-like systems, you can do something like:
  `$ export VARIABLE='VALUE'`
  * So you could set your page token and verify token with something like:
  `$ export PAGE_TOKEN="<your-page-token-from-facebook>"`
  `$ export VERIFY_TOKEN="<define-a-verify-token-yourself>"`
  * I recommend doing the following:
    * Create a `.env` file.
    * Set your enviroment variables in it:
    ```
    PAGE_TOKEN="<your-page-token-from-facebook>"`
    VERIFY_TOKEN="<define-a-verify-token-yourself>"`
    ```
    * Export the variables defined in it to your enviroment:
    `$ source .env`
    `$ export $(cut -d= -f1 .env)`

    * **Note: make sure to NEVER include the .env file in your source control. If you use Git, add `.env` to your .gitignore file.**
    * **Note: if you close your terminal session, you'll have to export your variables again.**
    * This way you can easily and securely have access to your tokens.

### Starting the project locally

* To run the project, type:

`$ npm start`

You should see something like this in your terminal window:
```
> my_first_messenger_bot@1.0.0 start /Users/lucasnarciso/Projects/test
> node bot.js

Echo bot server running at port 3000.
```

(If you saw an error message instead, please review the steps above. If you find that something is missing, please let me know.)

* Go to `localhost:3000` (typing `localhost:3000` in your browser) and see that it is up, even though it shows an error message
of wrong verify token. Don't worry, you'll be able to test your bot in a couple of minutes.

### Running the bot using ngrok

Now, Facebook just have to have access to your bot. Right now, your bot is only available locally.

Let's create a tunnel in the web to your localhost using ngrok.

* Run ngrok.
  * Go to the directory you put the ngrok executable after downloading it.
  * Run it:
  `$ ./ngrok http 3000

Your terminal window should now contain something like this:
```
Session Status                online
Version                       2.1.18
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://f51103b9.ngrok.io -> localhost:3000
Forwarding                    https://f51103b9.ngrok.io -> localhost:3000
```

Nice! If you (or anyone) access the given `ngrok.io` links, you will be accessing whatever there is in your localhost.

* Copy the `https` address. It is poiting to your localhost!
  (In my case, I would copy `https://f51103b9.ngrok.io`)

*Note: you must give Facebook an `https` address since it expects a secure endpoint.*

Back to Facebook again.

* Remember where you got the Token? Go to that same page and click on "Setup webhook".
* Paste the link ngrok generated and you just copied.
* Insert the verify token you defined earlier.
* Chose whatever option you'd like your bot to have, just don't forget to chose the obvious ones.

* Message your bot and see the magic happening. :)

### Running your bot on Heroku

So you want to turn off your computer and keep your bot working after that? Good news: that's not hard at all.

I bet you didn't skip the optinal part in the beggning of this tutorial, did you? So you have a Heroku account
and the Heroku toolbelt installed, rigth?

* First, you will need your project to be version controlled by git. Run:
  `$ git init`
  * Don't put the directory `/node_modules`, the file `.env` and the file npm-debug.log under source control.
  * Create a file named .gitignore and insert the following content:
  ```
  /node_modules
  npm-debug.log
  \*.env
  ```

* Add the things you made so far and commit it:
`$ git add .`
`$ git commit -m "I made a messenger bot! It just echoes right now."

* Login to Heroku:
`$ heroku login`

* Create a Heroku app:
`$ heroku create <your-app-name>`
(Hint: if you don't give an app name as argument, Heroku will chose one for you.)

* Deploy your app to Heroku:
`$ git push heroku master`

It should detect it is a NodeJS project and deploy with no problems.

* Go to the Heroku Dashboard on the web, select your project and go to settings.
* Define your enviroment variables there (PAGE_TOKEN and VERIFY_TOKEN).

If you have setup your webhook with ngrok, just go back to Facebook Dashboard and change the link. Now
you put the `<your-app-name>.herokuapp.com` link in there.

If you don't, I will say again how to do that ~ignoring the DRY principle so things are easier for you~:

Back to Facebook.

* Remember where you got the Token? Go to that same page and click on "Setup webhook".
* Paste the link of your Heroku app. (Hint: you can type `heroku open` on the terminal to open it in a browser.)
* Insert the verify token you defined earlier.
* Chose whatever option you'd like your bot to have, just don't forget to chose the obvious ones.

* Message your bot and see the magic happening. :)

Should you have any questions, contact me at lucasnar@gmail.com.
