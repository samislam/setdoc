**setDoc** is a small and simple utility for fetching data from the database using Mongoose.

# Examples:

### as an ExpressJs Middleware

```js
/*=============================================
=            as an ExpressJs Middleware            =
=============================================*/

app.get(
  '/users',
  setDocMw((req) => req.$loggedInUser.model.find({}), { propName: '$users' }),
  (req, res, next) => {
    console.log(req.$users)
    // [
    //   {
    //     id: 1,
    //     name: 'Murat',
    //   },
    //   {
    //     id: 2,
    //     name: 'Omer',
    //   },
    //   {
    //     id: 3,
    //     name: 'Yaser',
    //   },
    // ]
  }
)
```

### or as a regular JavaScript function

```js
app.get(
  '/users',
  expressAsyncHandler(async (req, res, next) => {
    const users = await setDoc(UserModel.find({}))
    console.log(users)
    // [
    //   {
    //     id: 1,
    //     name: 'Murat',
    //   },
    //   {
    //     id: 2,
    //     name: 'Omer',
    //   },
    //   {
    //     id: 3,
    //     name: 'Yaser',
    //   },
    // ]
  })
)
```

# API:

The API is pretty simple, there are two functions that can be used out of **setDoc**, the **setDoc** JavaScript function and the **setDocMw** ExpressJs Middleware.

first, let's look at the regular setDoc function:

# `setDoc(query: function, options: object)`

a JavaScript function, queries your database and fetches the data, then returns the database responded document. and if the record requested wasn't found, `setDoc()` will throw an error.

- `query`: _function_, ex: ((req)=>`UserModel.find()`, or `()=>ToursModel.findById(req.params.id)`).
  - it's important to point out that you must leave the query as it is without awaiting it, awaiting it is the job of **setDoc** itself.
  - if you provided a function, your function will be called without any argument, and your function must return a mongoose query, ex: `()=> UserModel.findById(req.params.id)`.
- `options`: _object_, options to configure how setDoc works

## Available options

- `notFoundErr`: throw an error when the database query returns undefined (default: true).
  - this will not have an effect if the database query returned an empty array.
- `notFoundMsg`: the message to display in the error when the database query returns undefined (default: _"The resource you requested was not found"_).
- `notFoundStatusCode`: the status code in the error to have when the database query returns undefined (default: 404).

secondly, let's have a look at the middleware:

# `setDocMw(query: function , options: object | function)`

an ExpressJs middleware, queries your database and fetches the data, then sets the database responded document on the express `req` object with the property name you specify, which can be then accessed for example as `req.mainDoc` or `req.mainDocs`. and if the record requested wasn't found, `setDocMw()` will send the error to the client.

- `query`: _function_, ex: ((req)=>`UserModel.find()`, or `(req)=>ToursModel.findById(req.params.id)`).
  - it's important to point out that you must leave the query as it is without awaiting it, awaiting it is the job of **setDoc** itself.
  - if you provided a function, your function will be called with the express `req` object, and your function must return a mongoose query, ex: `(req)=> UserModel.findById(req.params.id)`.
- `options`: _object_ or _function_, options to configure how setDoc works.
  - if you provided a function, your function will be called with the `req` object, and your function must return an object, ex: `(req) => ({ options-here })`.

## Available options

- `notFoundErr`: throw an error when the database query returns undefined (default: true).
  - this will not have an effect if the database query returned an empty array.
- `notFoundMsg`: the message to display in the error when the database query returns undefined (default: _"The resource you requested was not found"_).
- `notFoundStatusCode`: the status code in the error to have when the database query returns undefined (default: 404).
- `propName`: _string_, the property name to set on the request object (default: `undefined`).
  - if this property is set, the properties `ifSinglePropName` and `ifMultiPropName` are ignored.
- `ifSinglePropName`: _string_, the property name to set on the request object if the response from the database was a single value (i.e, object for example, not an array) (default : 'mainDoc').
- `ifMultiPropName`: _string_, the property name to set on the request object if the response from the database was an array (default: 'mainDocs').
- `handleError`: _boolean_, send a _setDoc_404_error_ if the database query returns undefined, if set to false, `next()` is called with the error (default: `true`)

# `globalOptions`

This one is an object, which has the following properties:

- `notFoundErr`: true,
- `notFoundMsg`: 'The resource you requested was not found',
- `notFoundStatusCode`: 404,
- `propName`: undefined,
- `ifSinglePropName`: 'mainDoc',
- `ifMultiPropName`: 'mainDocs',
- `handleError`: true,

You can use this object to overwrite the default properties used internally within setDoc from here.
remember to modify these if you wanted to (**globally**) before running any other setDoc functions.

> **Tip** 💡:
>
> If you're looking to modify any of these locally, not globally, use the **options** argument of `setDoc()` or `setDocMw()`, this one is only used to overwrite the default messages **globally**.

### For example:

```js
const globalOptions = require('setdoc')
globalOptions.notFoundErr: false // this will have effect globally
```

# Error Handling:

There's only one error that setDoc can throw, it's the error when a document is not found. For `setDoc()` it throws the error, while for `setDocMw` it sends the error automatically, however, you can disable that behaviour, using the `handleError` option.

To handle the error, the error has the following properties:

- `name`: 'setDoc_404_error'
- `message`: the message chosen when the database query returns undefined, (default _"The resource you requested was not found"_).
- `statusCode`: the status code chosen when the database query returns undefined (default: _404_).
- `stack`: the call stack for the error.

For example, if you want to handle a setDoc() function call error:

```js
try {
  const doc = await setDoc(Model.findOne({ email: 'murat@email.com' }))
} catch (error) {
  console.log(error)
  //   {
  //     name: 'setDoc_404_error',
  //     message: "The resource you requested was not found"
  //     statusCode: 404,
  //     stack: ...the error stack
  //   }
  // --- then send the response with the error
}
```

But normally, you wouldn't bother adding try/catch blocks around your code, because you're must likely going to have this code in an express middleware, you can use an npm package like [express-async-handler](https://www.npmjs.com/package/express-async-handler) for that, ex:

```js
app.get(
  expressAsyncHandler(async (req, res, next) => {
    const doc = await setDoc(Model.findOne({ email: 'murat@email.com' }))
    // the rest of your code normally
  })
)
```

in this example, if setDoc throws an error, the **expressAsyncHandler** middleware is going to capture that error and will call next with the thrown error directly.

If you're using `setDocMw()`, the error will be handled and sent to the client automatically, no need for error handling, except if you set the `handleError` option to false, in this case, `next()` will be called with the error, which you cna handle then in your [express error handling middleware](https://expressjs.com/en/guide/error-handling.html), ex:

```js
app.get(
  '/users/:id',
  setDocMw((req) => UserModel.findById(req.params.id))
)

app.use((err, req, res, next) => {
  if (err.name === 'setDoc_404_error') {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    })
  }
})
```

# FAQ:

**Q**: does `setDocMw()` call next internally?

- Yes it does, and there's no way to disable that.

**Q**: is there a way I can prevent `setDocMw()` from sending the error? what if I wanted to handle that error myself?

- use the `handleError` option and set it to false, this way, setDocMw will call next with the error.
