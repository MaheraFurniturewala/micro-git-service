module.exports = async function getRepos(repoNames) {
    console.log(repoNames)
    const repos = []
    for (const name of repoNames) {
        const repo = await octokit.request(`GET /repos/1407arjun/{repo}`, {
            repo: name
        })
        repos.push(repo.name)
    }
    return repos
}
