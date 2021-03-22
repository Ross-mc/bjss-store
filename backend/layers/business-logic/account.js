const crypto = require('crypto')

function NewAccountService(accountDb) {

    async function signIn(email, password) {
        const account = await accountDb.getByEmail(email)

        if (!account)
            return { error: 'invalidEmail', account: email }

        if (!validatePassword(password, account.passwordHash))
            return { error: 'invalidPassword', account: email }

        return omitPasswordHash(account)
    }

    async function signUp({ email, password, name, address, postcode }) {
        const account = await accountDb.add({
            email,
            name,
            address,
            postcode,
            passwordHash: hashPassword(password)
        })
        return omitPasswordHash(account)
    }

    async function update(account) {
        const toUpdate = { ...account }

        if (toUpdate.password) {
            toUpdate.passwordHash = hashPassword(toUpdate.password)
            delete toUpdate.password
        }

        return omitPasswordHash(await accountDb.update(toUpdate))
    }

    async function getById(accountId) {
        const account = await accountDb.getById(accountId)
        return account && omitPasswordHash(account)
    }

    return {
        signIn,
        signUp,
        getById,
        update
    }
}

module.exports = {
    NewAccountService
}

function omitPasswordHash(account) {
    delete account.passwordHash
    return account
}

// Don't try this at home kids. Use a cloud service for authentication stuf.
const strongishHash = (password, salt) =>
    crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('base64')

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('base64')
    const hash = strongishHash(password, salt)
    return hash + ':' + salt
}

function validatePassword(password, hashNsalt) {
    const [hash, salt] = hashNsalt.split(':')
    const newHash = strongishHash(password, salt)
    return hash === newHash;
}