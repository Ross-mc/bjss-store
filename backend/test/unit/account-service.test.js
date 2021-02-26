const expect = require('chai').expect
const NewAccountDatabase = require('../../layers/data-access/memory/account').NewAccountDatabase
const NewAccountService = require('../../layers/business-logic/account').NewAccountService

describe('Account Service', () => {

    // Mainly happy path regression testing for this toy app. 
    // The error / edge case handling isn't that good anyway. 

    let service

    const signUpData = {
        email: 'a@example.com', name: 'a', address: 'addr', postcode: 'abc123', password: 's3cret'
    }

    const createAccount = async () => service.signUp(signUpData)

    beforeEach(async () => {
        service = NewAccountService(await NewAccountDatabase())
    })

    it('signs up ok', async () => {
        const account = await service.signUp(signUpData)
        compareAccountData(account,signUpData)
        expect(account.id.length).to.be.greaterThan(10) // check it is non-trivial
    })

    it('signs in ok', async () => {
        await createAccount()
        const account = await service.signIn(signUpData.email, signUpData.password)
        compareAccountData(account,signUpData)
    })

    it('fails sign in', async () => {
        await createAccount()
        let response = await service.signIn(signUpData.email, 'not password')
        expect(response.error).to.equal('invalidPassword')

        response = await service.signIn('invalid@example.com', signUpData.password)
        expect(response.error).to.equal('invalidEmail')
    })

    it('fetches an account', async () => {
        const account = await createAccount()
        const fetched = await service.getById(account.id)
        compareAccountData(fetched,account)
    })

    it('updates an account including password and can sign in', async () => {
        const account = await createAccount()
        account.name = 'b'
        account.password = 'newpass'
        const updated = await service.update(account)
        compareAccountData(updated,account)

        const signInResponse = await service.signIn(account.email, account.password)
        expect(signInResponse).to.not.contain.key('error')
    })
})

function compareAccountData(actual, expected) {

    const pluck = toPluck => (({id, password, ...o})=>o)(toPluck)

    const pluckedActual = pluck(actual)
    const pluckedExpected = pluck(expected)

    expect(pluckedActual).to.eql(pluckedExpected)
}

