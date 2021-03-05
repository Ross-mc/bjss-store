const utils = require('../../../utils/utils')

// We clone (deep copy) everything we put in and take out of our in memory
// data store. This prevents calling code that has retained a refence to it
// from being able to acidentally manipulate data that is now inside our
// fake database. 
const clone = utils.clone

async function NewAccountDatabase() {
    const accounts = []
    let idCounter = 0

    async function add(account) {
        // In a SQL database we might enforce this constraint in the database itself
        if (await getByEmail(account.email))
            throw new Error(`${account.email} already registered`)

        const toInsert = {id: idCounter++, ...clone(account)}
        accounts.push(toInsert)
        return clone(toInsert)
    }

    async function getByEmail(email) {
        const found = accounts.find(account => utils.equalsIgnoreCase(account.email, email))
        return found ? clone(found) : undefined
    }

    async function getById(accountId) {
        const found = accounts.find(a => a.id === accountId)
        return found ? clone(found) : undefined
    }

    async function update(account) {
        const found = accounts.find(a => a.id === account.id)

        if (!found)
            throw new Error(`Account ${account.id} not found`)

        // overwrite any properties we were given
        Object.assign(found, clone(account))

        return clone(found)
    }

    return {
        getByEmail,
        getById,
        add,
        update
    }
}

module.exports = {
    NewAccountDatabase
}

