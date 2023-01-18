const getContent = require("./getContent")

module.exports = async function onPush(context) {
    const { refs, repository } = context
    const { name, head_commit } = repository
    const { added, modified } = head_commit

    //const branch = refs.split("/")[refs.split("/").length - 1]

    let branch = "main"
    let repo = "client"
    let path = "src/types"

    let all = [...added, ...modified]
    all = all.filter((file) => file.includes(path))

    const blobs = []

    for (const file of all) {
        const content = await getContent("1407arjun", repo, path, false)
        blobs.push(content)
    }
}
