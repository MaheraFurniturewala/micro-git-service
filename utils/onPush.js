const getContent = require("./getContent")
const makeCommit = require("./makeCommit")

module.exports = async function onPush(context) {
    const { refs, repository, pusher, head_commit } = context.payload

    if (pusher.name !== "tiny-hack[bot]") {
        const { name } = repository
        const { added, modified } = head_commit

        let branch = "main"
        let repo = "client"
        let path = "src/types"

        let all = [...added, ...modified]
        all = all.filter((file) => file.includes(path))

        const blobs = {}

        for (const file of all) {
            const content = await getContent("1407arjun", name, file)
            blobs[file] = content
        }

        await makeCommit(blobs, repo, branch)
    }
}
