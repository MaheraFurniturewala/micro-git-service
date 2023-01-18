const getContent = require("./getContent")
const makeCommit = require("./makeCommit")

module.exports = async function onPush() {
    // const { refs, repository } = context
    // const { name, head_commit } = repository
    // const { added, modified } = head_commit

    //const branch = refs.split("/")[refs.split("/").length - 1]

    let branch = "main"
    let repo = "client"
    let path = "src/types"

    //let all = [...added, ...modified]
    //all = all.filter((file) => file.includes(path))

    let all = ["src/types/message.ts"]
    const blobs = {}

    for (const file of all) {
        const content = await getContent("1407arjun", repo, file)
        blobs[file] = content
    }

    await makeCommit(blobs, repo, branch)
}
