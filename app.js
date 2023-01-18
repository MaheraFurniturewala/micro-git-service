/**
 * @param {import('probot').Probot} app
 */

const { Octokit } = require("@octokit/core")
const { createAppAuth } = require("@octokit/auth-app")
const getContent = require("./utils/getContent")
const getRepos = require("./utils/getRepos")

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

    app.log("Yay! The app was loaded!")

    const server = getRouter("/")

    server.get("/repo", async (req, res) => {
        const prompt = require("prompt-sync")({ sigint: true })
        const repoNames = prompt(
            "Enter the repos to be mapped (space seperated): "
        ).split(" ")

        try {
            const repos = []

            for (const repo of repoNames) {
                const mapFile = await getContent(
                    "1407arjun",
                    repo,
                    ".gitignore"
                )
                repos.push({ name: repo, mapping: mapFile.split("\n") })
            }
        } catch (err) {
            app.log(err.message)
        }
    })

    app.on("issues.opened", async (context) => {
        return context.octokit.issues.createComment(
            context.issue({ body: "Hello, World!" })
        )
    })
}
