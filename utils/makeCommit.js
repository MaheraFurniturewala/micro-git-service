async function postSha(content, repo) {
    const { sha } = await octokit.request(
        "POST /repos/1407arjun/{repo}/git/blobs",
        { repo, body: { content, encoding: "base64" } }
    )
    return sha
}

module.exports = async function makeCommit(diff, repo, branch) {
    const last_sha = await octokit.request(
        "GET /repos/1407arjun/{repo}/branches/{branch_name}",
        { repo, branch_name: branch }
    ).commit.sha

    const tree = { base_tree: last_sha, tree: [] }
    for (const file in Object.keys(diff)) {
        const sha = await postSha(diff[file], repo)
        tree.tree.push({
            path: file,
            mode: "100644",
            type: "blob",
            sha
        })
    }

    const treeSha = await octokit.request(
        "POST /repos/1407arjun/{repo}/git/trees",
        { repo, body: tree }
    ).sha

    const { sha } = await octokit.request(
        "POST /repos/1407arjun/{repo}/git/commits",
        {
            repo,
            body: {
                message: "Sync files",
                author: {
                    name: "tiny-hack",
                    email: "noreply@tinyhack.co"
                },
                parents: [last_sha],
                tree: treeSha
            }
        }
    )

    await octokit.request(
        "POST /repos/1407arjun/{repo}/git/refs/heads/{branch}",
        {
            repo,
            branch,
            body: {
                ref: `refs/heads/${branch}`,
                sha
            }
        }
    )
}
