# BJSS Store 

Academy 2021 TODO
- Make API consistent with spec and consistent property casing.
- Flip out Sequlise for something using raw SQL
- Layers: data access (incl mock), biz, api handler/imperative shell
   - Maybe unit tests, split integration/unit
- Tidy deps.
- Simplify / structure code
- Implement signin/registration
- Fix swagger or remove
- Consider serving frontend on /

This is a Javascript backend using Node.JS to run the Javascript and a framework called Express to help implement the APIs. 

# Getting started

```
cd backend
npm install
code .
```

Start the server `npm start`
Run the integration tests against the server `npm test`

# Debugging

In VS Code, go to the debug tab. In the drop down select 'Debug Server' or 'Debug Tests'. Whichever one you select, you'll have to run the other one from the command line as above.