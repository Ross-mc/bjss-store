const utils = require('../../../utils/utils')

// The in-memory implementation of Account Database was implemented first and, 
// largely because it was easy, set Account's primary ID as a random string. We 
// follow that here. Would an int be better?
const schemaDdl = `
create table accounts (
    id char(22) primary key, 
    email text not null unique, 
    name text not null, 
    address text not null, 
    postcode text not null, 
    passwordHash text not null
);
`

async function NewAccountDatabase(db) {

    db.exec(schemaDdl)

    async function add(account) {
        try {
            const a = {...account, id: utils.urlSafeUniqueId()}
            const sql =
                `insert into accounts (id, email, name, address, postcode, passwordHash) 
                 values(?, ?, ?, ?, ?, ?)`
            db.prepare(sql).run(a.id, a.email, a.name, a.address, a.postcode, a.passwordHash)
            return getById(a.id)
        } catch (e) {
            // TODO Could be a whole set of other reasons. How do we check?
            throw new Error(`${account.email} already registered`)
        }
    }

    async function getByEmail(email) {
        return db.prepare('select * from accounts where email = ?').get(email)
    }

    async function getById(accountId) {
        return db.prepare('select * from accounts where id = ?').get(accountId)
    }

    async function update(account) {
        const found = db.prepare('select * from accounts where id = ?').get(account.id)
        if (!found)
            throw new Error(`Account ${account.id} not found`)

        // overwrite any properties we were given
        Object.assign(found, account)

        const a = found
        db.prepare(
            `update accounts set
            (id, email, name, address, postcode, passwordHash) = (?, ?, ?, ?, ?, ?)`
        ).run(a.id, a.email, a.name, a.address, a.postcode, a.passwordHash)
        return found
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

