/**
 * @param {import('probot').Probot} app
 */

const { Octokit } = require("@octokit/rest");
const { createAppAuth } = require("@octokit/auth-app");

require("dotenv").config()

module.exports = async (app, {getRouter}) => {
  app.log("Yay! The app was loaded!");

  const server = getRouter("/");

  server.get("/", async (req, res) => {
    res.send("Hello");
  });

  server.get("/repo/:owner/:repo", async (req, res) => {
    const { owner, repo } = req.params;
  
    const installationOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: process.env.APP_ID,
        privateKey: process.env.PRIVATE_KEY,
        installationId: 33254077,
      },
    });
  
    const repos = await installationOctokit.request(`GET /repos/${owner}/${repo}`)
    res.json(repos);
  });

  app.on("issues.opened", async (context) => {
    return context.octokit.issues.createComment(
      context.issue({ body: "Hello, World!" })
    );
  });
};
