const getContent = require("./getContent")

module.exports = async function mapRepos(repoNames) {
    try {
        for (const repo of repoNames) {
            const content = await getContent("1407arjun", repo, "microgit.json")
            const jsonContent = JSON.parse(content)

            if (!maps[repo]) {
                maps[repo] = {}
            }

            if (!maps[repo][jsonContent.branch]) {
                maps[repo][jsonContent.branch] = {}
            }

            maps[repo][jsonContent.branch].path = jsonContent.path
        }
    } catch (err) {
        app.log(err.message)
    }
}
