
function NewAccountApi(accountService) {

    /**
     * Use these functions to update the currently signed in user in the session
     */
    const getSignedInUserId = req => req.session.customerId
    const setSignedInUserId = (req, customerId) => req.session.customerId = customerId

    async function postSignIn(req, res) {
        // To implement
    }

    async function postSignUp(req, res) {
        // To implement        
    }

    async function getAccount(req, res) {
        // To Implement
    }

    async function postAccount(req, res) {
        // To Implement
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