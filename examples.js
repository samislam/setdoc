/*=============================================
=            as a regular JavaScript function            =
=============================================*/
let users
users = await setDoc(User.findById(req.params.id))
users = await setDoc(User.findById(req.params.id), { notFoundMsg: "Couldn't find that record" })

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

app.get(
  '/users',
  setDocMw(UserModel.find({}), (req) => ({ ifMultiPropName: '$users' })),
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
