function NewAccountApi(accountService) {

    /**
     * Use these functions to update the currently signed in user in the session
     */
    const getSignedInUserId = req => req.session.customerId
    const setSignedInUserId = (req, customerId) => req.session.customerId = customerId

//     POST /account/sign-in {email: string, password: string} => AccountApiResponse, starts session
// POST /account/sign-up ShippingDetails => AccountApiResponse, starts session
// GET  /account ShippingDetails => AccountApiResponse, must be signed in
// POST /account ShippingDetails => AccountApiResponse, must be signed in

    async function postSignIn(req, res) {
        const { email, password } = req.body;
        if (!email || !password){
            res.status(400).json({message: "malformed body"})
        }
        const signedInAccount = await accountService.signIn(email, password);
        if (signedInAccount.error){
            res.status(401).json({message: "Invalid login details"})
        } else {
            setSignedInUserId(req, signedInAccount.id)
            res.cookie('customerId', signedInAccount.id).status(200).json(signedInAccount);
        }
    }

    async function postSignUp(req, res) {
        const { email, name, address, postcode, password } = req.body;
        if (!email || !name || !address || !postcode || !password){
            return res.status(400).json("Malformed request body");
        }    
        try {
            const newAccount = await accountService.signUp({email, name, address, postcode, password});
            const signedInAccount = await accountService.signIn(email, password);
            const signedInUserId = setSignedInUserId(req, newAccount.id);
            return res.cookie('customerId', newAccount.id).status(200).json(signedInAccount);
        } catch (e) {
            console.error('error inside catch', e)
            return res.status(401).json({errorMsg: "Email already registered"})
        }   
    }

    async function getAccount(req, res) {
        const signedInUserId = await getSignedInUserId(req);
        const signedInAccount = await accountService.getById(signedInUserId);
        return res.status(200).json(signedInAccount) 
    }

    async function postAccount(req, res) {
        const validProps = ["password", "email", "name", "address", "postcode", "id"];
        const propsSent = Object.keys(req.body);
        const areAllPropsValid = propsSent.every(prop => validProps.includes(prop));
        if (areAllPropsValid){
            const signedInUserId = await getSignedInUserId(req);
            const updatedUser = await accountService.update({id: signedInUserId, ...req.body});
            return res.status(200).json(updatedUser);
        } else {
            return res.status(400).json({errorMsg: "malformed request"});
        }
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