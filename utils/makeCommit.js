async function postSha(content, repo) {
    let sha = await octokit.request("POST /repos/1407arjun/{repo}/git/blobs", {
        repo,
        content,
        encoding: "utf-8"
    })

    return sha.data.sha
}

module.exports = async function makeCommit(diff, repo, branch) {
    let last_sha = await octokit.request(
        "GET /repos/1407arjun/{repo}/branches/{branch_name}",
        { repo, branch_name: branch }
    )

    last_sha = last_sha.data.commit.sha

    const tree = { base_tree: last_sha, tree: [] }
    for (const file of Object.keys(diff)) {
        const sha = await postSha(diff[file], repo)
        tree.tree.push({
            path: file,
            mode: "100755",
            type: "blob",
            sha
        })
    }

    let treeSha = await octokit.request(
        "POST /repos/1407arjun/{repo}/git/trees",
        { repo, ...tree }
    )

    treeSha = treeSha.data.sha

    let sha = await octokit.request(
        "POST /repos/1407arjun/{repo}/git/commits",
        {
            repo,
            message: "Sync files",
            author: {
                name: "tiny-hack",
                email: "noreply@tinyhack.co"
            },
            parents: [last_sha],
            tree: treeSha
        }
    )

    sha = sha.data.sha

    await octokit.request(
        "POST /repos/1407arjun/{repo}/git/refs/heads/{branch}",
        {
            repo,
            branch,
            ref: `refs/heads/${branch}`,
            sha
        }
    )
}
