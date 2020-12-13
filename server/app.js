const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const schema = require("../schema/schema")

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.listen(3000, err => {
  err ? console.log(err) : console.log(`Server started on PORT `)
})
