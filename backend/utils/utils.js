const crypto = require('crypto')

const caseInsensitiveIncludes = (toSearchIn, toFind) =>
    toSearchIn.toLowerCase().includes(toFind.toLowerCase())

const equalsIgnoreCase = (a, b) => a.toLowerCase() === b.toLowerCase()

const clone = object => JSON.parse(JSON.stringify(object))

const pick = (o, ...props) =>
    Object.assign({}, ...props.map(prop => ({[prop]: o[prop]})));

const base64ToBase64UrlSafe = base64 =>
    base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")

const urlSafeUniqueId = () => {
    // Good enough collision properties, like UUID but simpler
    const random128bitNumber = crypto.randomBytes(16)
    // Safe for putting in URLs in APIs, etc
    return base64ToBase64UrlSafe(random128bitNumber.toString('base64'))
}

const newEntityFromObject = object => ({ id: urlSafeUniqueId(), ...clone(object) })


module.exports = {
    caseInsensitiveIncludes,
    equalsIgnoreCase,
    clone,
    pick,
    newEntityFromObject,
    urlSafeUniqueId
}