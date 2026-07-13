// Patch باش نحلو خطأ File is not defined ديال undici
global.File = class File {};
global.FormData = class FormData {};
global.Blob = class Blob {};

const app = require("express")();
const Discord = require('discord.js');
const chalk = require('chalk');
require('dotenv').config({ path: './.env' });
const axios = require('axios');
const webhook = require("./config/webhooks.json");
const config = require("./config/bot.js");

const webHooksArray = ['startLogs', 'shardLogs', 'errorLogs', 'dmLogs', 'voiceLogs', 'serverLogs', 'serverLogs2', 'commandLogs', 'consoleLogs', 'warnLogs', 'voiceErrorLogs', 'creditLogs', 'evalLogs', 'interactionLogs'];

// Check if.env webhook_id and webhook_token are set
if (process.env.WEBHOOK_ID && process.env.WEBHOOK_TOKEN) {
    for (const webhookName of webHooksArray) {
        if(webhook[webhookName]){
            webhook[webhookName].id = process.env.WEBHOOK_ID;
            webhook[webhookName].token = process.env.WEBHOOK_TOKEN;
        }
    }
}

console.clear();
console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)), (chalk.green(`Starting up`)), (chalk.white(`...`)))
console.log(`\u001b[0m`)
console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)), chalk.red(`Version ${require(`${process.cwd()}/package.json`).version}`), (chalk.green(`loaded`)))
console.log(`\u001b[0m`);

app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <html>
            <head><title>FastLife Bot</title></head>
            <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#0f0f14;color:#fff;font-family:sans-serif;">
                <div style="text-align:center;">
                    <h1>🟢 FastLife Bot is online</h1>
                    <p>Developer: Ghostx</p>
                </div>
            </body>
        </html>
    `);
    res.end()
});

const PORT = process.env.PORT || 3000; // مهم لـ Railway
app.listen(PORT, () => console.log(chalk.blue(chalk.bold(`Server`)), (chalk.white(`>>`)), (chalk.green(`Running on`)), (chalk.red(PORT))))

require('./bot')

// Webhooks
const consoleLogs = new Discord.WebhookClient({
    id: webhook.consoleLogs.id,
    token: webhook.consoleLogs.token,
});

const warnLogs = new Discord.WebhookClient({
    id: webhook.warnLogs.id,
    token: webhook.warnLogs.token,
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    let errorMsg = error.toString();
    let errorStack = error.stack? error.stack.toString() : "No stack error";
    
    if (errorMsg.length > 950) errorMsg = errorMsg.slice(0, 950) + '... view console for details';
    if (errorStack.length > 950) errorStack = errorStack.slice(0, 950) + '... view console for details';
    
    const embed = new Discord.EmbedBuilder()
      .setTitle(`🚨・Unhandled promise rejection`)
      .addFields([
            {
                name: "Error",
                value: Discord.codeBlock(errorMsg),
            },
            {
                name: "Stack error",
                value: Discord.codeBlock(errorStack),
            }
        ])
    consoleLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending unhandled promise rejection to webhook')
        console.log(error)
    })
});

process.on('warning', warn => {
    console.warn("Warning:", warn);
    const embed = new Discord.EmbedBuilder()
      .setTitle(`🚨・New warning found`)
      .addFields([
            {
                name: `Warn`,
                value: `\`\`\`${warn}\`\``,
            },
        ])
    warnLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending warning to webhook')
        console.log(warn)
    })
});
