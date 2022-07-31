**setDoc** is a small and simple utility for querying your database with Mongoose.

# Quick Overview 🍇:

**setDoc** can be used as an express middleware, for example:

```js
app.get(
  '/users',
  setDocMw((req) => UserModel.find({}), { propName: '$users' }),
  (req, res, next) => {
    // use it as req.$users here
  }
)
```

**setDoc** can also be used as a regular JavaScript function, for example:

```js
app.get(
  '/users',
  expressAsyncHandler(async (req, res, next) => {
    const users = await setDoc(UserModel.find({}))
    // users is the database response for calling UserModel.find({})
  })
)
```

or quickly set the doc and send the response:

```js
app.get(
  '/users',
  sendDocMw((req) => UserModel.find({}))
)
```

# Examples: 🍎

### Example #1:

```js
const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const app = express()
const { setDoc, setDocMw, sendDocMw } = require('setDoc')
const { UserModel } = require('./models/UserModel')

app.use(express.json())

app.route('/api/users').get(
  setDocMw((req) => UserModel.find({}, { propName: 'docs' })),
  (req, res, next) => {
    res.status(200).json({ data: req.docs })
  }
)
app
  .route('/api/users/:id')
  .get(sendDocMw((req) => UserModel.findById(req.params.id)))
  .patch(
    expressAsyncHandler(async (req, res, next) => {
      const doc = await setDoc(() => UserModel.findByIdAndUpdate(req.params.id, req.body))
      res.status(200).json({
        data: doc,
      })
    })
  )
app.use((err, req, res, next) => {
  if (err.name === 'setDocNotFoundError') {
    res.status(err.statusCode).json({
      message: err.message,
    })
  }
})
app.listen(3000, () => console.log('listening on port 3000...'))
```

### Example #2:

```js
app.get(
  '/channels/:channelId',
  setDocMw(UserModel.find({}), (req) => ({
    post(doc) {
      console.log(doc)
      // {
      //   name: 'Kids Playhouse!',
      //   email: 'kids@kidi.com',
      //   subscribers: [
      //     {
      //       id: 1,
      //       name: 'Murat',
      //     },
      //     {
      //       id: 2,
      //       name: 'Omer',
      //     },
      //     {
      //       id: 3,
      //       name: 'Yaser',
      //     },
      //   ]
      // }
      return doc.subscribers
    },
  })),
  (req, res, next) => {
    console.log(req.mainDocs)
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

# API: 🥥

# `setDoc(query: function, options: object)`: Promise

a JavaScript function, queries your database, then returns the resolved value of the query.

<ins>parameters:</ins>

- **query**: _function_, ex: `setDoc((req)=>UserModel.find())`.
  - it's important to point out that you must leave the query as it is without awaiting it, awaiting it is the job of **setDoc** itself.
  - Your function will be called without arguments.
  - Your function must return a mongoose query.
- **options**: _object_, options to configure how setDoc works.
  - **notFoundErr**: _boolean_, throw an error when the database query returns undefined (default: **true**).
    - a _not found document_ is only considered not found if they query returned undefined.
  - **notFoundMsg**: _any_, the message to display in the error when a requested document is not found (default: \*"**The resource you requested was not found"\***).
  - **notFoundStatusCode**: _number_, the status code in the error to have when a document is not found (default: **404**).

# `setDocMw(query: function , options: object | function)`: express middleware

an ExpressJs middleware, queries your database, then sets the resolved value of the query on the express `req` object with the property name you specify, which can be then accessed for example as `req.mainDoc` or `req.mainDocs`.

<ins>parameters:</ins>

- **query:** *function*, ex: `setDocMw((req)=>UserModel.find())`.
  - it's important to point out that you must leave the query as it is without awaiting it, awaiting it is the job of **setDoc** itself.
  - Your function will be called with the express `req` object as the first argument.
  - Your function must return a mongoose query.
- **options:** *object |* _function_, options to configure how setDocMw works.
  - If you provided a function, your function will be called with the `req` object.
  - Your function must return an object, ex: `(req) => ({ options-here })`.
    - **notFoundErr**: _boolean_, consider it an error when the database query returns undefined (default: **true**).
      - a _not found document_ is only considered not found if the resolved value of the query was undefined.
    - **notFoundMsg**: _any_, the message to display in the error when the database query returns undefined (default: _"**The resource you requested was not found**"_).
    - **notFoundStatusCode**: _number_, the status code to have in the error when the database query returns undefined (default: **404**).
    - **handleNotFoundError**: _boolean_, send the meaningful response if a requested document wasn't found, if set to false, `next()` is called with a *setDocNotFoundError* error (default: **true**).
    - **callNext**: _boolean_,call `next()` as the last step.
      - set to **true** only if you have middlewares to execute after this one.
    - **propName**: _string_, the property name to set on the request object (default: **undefined**).
      - if this property is set, the options _ifSinglePropName_ and _ifMultiPropName_ will be ignored.
    - **ifSinglePropName**: _string_, the property name to set on the request object if the resolved value of the query wasn't an array (default : '**mainDoc**').
    - **ifMultiPropName**: _string_, the property name to set on the request object if the resolved value of the query was an array (default: '**mainDocs**').

# `sendDocMw(query: function , options: object | function)`: express middleware

an ExpressJs middleware, queries your database, then sends the resolved value of the query directly using the [sendRes](https://www.npmjs.com/package/@samislam/sendres) package with the options you specify.

<ins>parameters:</ins>

- **query:** *function*, ex: `sendDocMw((req)=>UserModel.findById(req.params.id))`.

  - it's important to point out that you must leave the query as it is without awaiting it, awaiting it is the job of **setDoc** itself.
  - Your function will be called with the express `req` object as the first argument.
  - Your function must return a mongoose query.

- **options:** *object |* _function_, options to configure how setDocMw works.
  - If you provided a function, your function will be called with the `req` object.
  - Your function must return an object, ex: `(req) => ({ options-here })`.
    - **notFoundErr**: _boolean_, consider it an error when the database query returns undefined (default: **true**).
      - a _not found document_ is only considered not found if the resolved value of the query was undefined.
    - **notFoundMsg**: _any_, the message to display in the error when the database query returns undefined (default: _"**The resource you requested was not found**"_).
    - **notFoundStatusCode**: _number_, the status code to have in the error when the database query returns undefined (default: **404**).
    - **handleNotFoundError**: _boolean_, send the meaningful response if a requested document wasn't found, if set to false, `next()` is called with a *setDocNotFoundError* error (default: **true**).
    - **callNext**: _boolean_,call `next()` as the last step.
      - set to **true** only if you have middlewares to execute after this one.
    - **statusCode**: _number_, the status code for the response on the success of the operation (default **200**).
    - **resBody**: _function_, a function that gets called with the resolved value of the database query, in this function, you must return an object, this object is what your response body is going to hold.
    - **sendRes**: _object_, the options you want to pass to the sendRes package, for these options, read them on the official docs of [sendRes](https://www.npmjs.com/package/@samislam/sendres).

# Error Handling: 🍅

There are two types of errors that could happen in the context of setDoc:

1.  **Mongoose Error**, ex: Cast errors, duplicate fields errors, validation errors.
    - for handling these errors, you should read [the Mongoose official docs](https://mongoosejs.com/).
2.  **setDoc Error**, and there's only one error type that setDoc has, which is the _setDocNotFoundError_,this error happens when a user is trying to query the database for a record that's just not there.
    - For `setDoc()`, it throws the error, which you may handle then using a try/catch blocks, [await-to](https://www.npmjs.com/package/await-to-js), or simply just an express error-handling middleware.
    - For `setDocMw()`, it sends the error automatically, however, you can disable that behavior, using the `handleNotFoundError` option.

To handle the error, the error has the following properties:

- `name`: **setDocNotFoundError**.
- `message`: (default _"**The resource you requested was not found**"_).
- `statusCode`: the status code chosen when the database query returns undefined (default: **404**).
- `stack`: the call stack for the error.

For example, if you want to handle a setDoc() function not found error:

```js
try {
  const doc = await setDoc(Model.findOne({ email: 'murat@email.com' }))
} catch (error) {
  console.log(error)
  //   {
  //     name: 'setDocNotFoundError',
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

In this example, if setDoc throws an error, the **expressAsyncHandler** middleware is going to capture that error and will call next with the thrown error directly, ex:

```js
app.use((err, req, res, next) => {
  if (err.name === 'setDocNotFoundError') {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    })
  }
})
```

# FAQ: 🍉

**Q**: Is there any way I can prevent `setDocMw()`/`sendDocMw()` from sending the error? what if I wanted to handle that error myself?

- Use the `handleNotFoundError` option and set it to false, this way, `setDocMw()` or `sendDocMw()` will call `next()` with the error.
