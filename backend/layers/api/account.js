
function NewAccountApi(accountService) {

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