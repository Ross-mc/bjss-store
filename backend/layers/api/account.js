
function NewAccountApi(accountService) {

    async function postSignIn(req, res) {
        const { email, password } = req.body

        if (!email || !password)
            return res.sendStatus(400)

        const account = await accountService.signIn(email, password)

        if (account.error) {
            // At the moment everywhere else we're trapping errors at the outer layer
            // logging and returning a 500. Or we're returning meaningful errors to
            // the caller. Here we don't want to return the details of the error
            // because that may help an attacker. We do want to know *why* the signin
            // failed (see OWASP Top 10 #10). So, for once, we log.  Note this should
            // really be monitoringService.event(error) rather than log but this'll do
            console.log(error)
            return res.sendStatus(403)
        }
        req.session.customerId = account.customerId // this indicates user is signed in!
        res.json(account)
    }

    async function postSignUp(req, res) {
        const { email, password, name, address, postcode } = req.body

        // This validation is awful.  How should it be improved?
        if (!email || !password || !name || !address || !postcode)
            return res.sendStatus(400)

        // TODO handle duplicate email better.  At the moment this'll be a 500 error

        const account = await accountService.signUp(req.body)
        req.session.customerId = account.customerId
        res.json(account)
    }

    async function getAccount(req, res) {
        const account = await accountService.getAccount(req.session.customerId)
        res.json(account)
    }

    const removeEmptyValues = o =>
        Object.fromEntries(Object.entries(o).filter(([_, v]) => !v));

    async function postAccount(req, res) {
        // This whitelists what we can update. i.e. prevents directly updating
        // passwordHash or adding myRandomProperty to the account
        const { email, password, name, address, postcode } = req.body
        const customerId = req.session.customerId

        const update = removeEmptyValues({ customerId, email, password, name, address, postcode })

        const account = await accountService.update(update)
        res.json(account)
    }

    return {
        postSignIn,
        postSignUp,
        getAccount,
        postAccount
    }
}

module.exports = {
    NewAccountApi
}