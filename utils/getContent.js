module.exports = async function getContent(owner, repo, path) {
    try {
        const { data } = await octokit.request(
            `GET /repos/{owner}/{repo}/contents/{path}`,
            {
                owner,
                repo,
                path
            }
        )
        return Buffer.from(data.content, "base64").toString()
    } catch (err) {
        if (err.status === 404) {
            octokit.log.warn(`Path not found`)
            return
        } else {
            throw err
        }
    }
}
