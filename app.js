/**
 * @param {import('probot').Probot} app
 */

const { Octokit } = require("@octokit/core")
const { createAppAuth } = require("@octokit/auth-app")
const mapRepos = require("./utils/mapRepos")
const onPush = require("./utils/onPush")

require("dotenv").config()

module.exports = async (app, { getRouter }) => {
    const installationOctokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
            appId: process.env.APP_ID,
            privateKey: process.env.PRIVATE_KEY,
            installationId: 33254077
        }
    })

    global.octokit = installationOctokit
    global.maps = {}
    global.app = app

    app.log("Yay! The app was loaded!")

    const prompt = require("prompt-sync")({ sigint: true })
    const repoNames = prompt(
        "Enter the repos to be mapped (space seperated): "
    ).split(" ")
    await mapRepos(repoNames)

    app.on("push", onPush)
}
