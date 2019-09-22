const express = require('express')
const dotenv = require('dotenv')
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios')
dotenv.config()

const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })

app = express()

bot.onText(/\/todos/, (msg, match) => {
    var todoList = []

    axios.get(`https://api.github.com/users/ticklepoke/repos?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`)
        .then(async (res) => {
            const length = res.data.length
            for (var i = 0; i < length; i++) {
                var urlPath = res.data[i]["svn_url"]
                const name = res.data[i]["name"]
                urlPath = urlPath.replace(/https:\/\/github.com\//, '')
                urlPath = "htts://raw.githubusercontent.com/" + urlPath + "/master/README.md"
                await axios.get(urlPath)
                    .then((res) => {
                        var todos = res.data.match(/TODO[\n][-a-zA-Z" "\n]+/);

                        if (todos != null) {
                            todos = todos[0].replace("TODO", "")
                            todos = todos.split("\n- ")
                            todos[0] = name
                            todoList.push(todos)

                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }

            var respText = ""
            for (var i = 0; i < todoList.length; i++) {
                respText = respText + "Repository: " + todoList[i][0] + "\n"
                for (var j = 1; j < todoList[i].length; j++) {
                    respText = respText + "- " + todoList[i][j] + "\n"
                }
                respText = respText + "\n"
            }
            bot.sendMessage(process.env.TELEGRAM_CHAT_ID, respText);
        })
        .catch(err => {
            console.log("error:" + JSON.stringify(err))
        })

});


const PORT = 5001;
app.listen(PORT, () => console.log(`App running on ${PORT}`))



