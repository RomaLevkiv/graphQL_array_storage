const graphql = require("graphql")
const { uuid } = require("uuidv4")

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} = graphql

const posts = [
  { id: 1, message: "What's up!", authorId: 3 },
  { id: 2, message: "Hello", authorId: 1 },
  { id: 4, message: "Good Bye", authorId: 1 },
  { id: 3, message: "I'm glad to see you", authorId: 2 },
]

authors = [
  { id: 1, name: "Sergiy", birthYear: 1982 },
  { id: 2, name: "Roman", birthYear: 1985 },
  { id: 3, name: "Kolya", birthYear: 1996 },
]

const PostType = new GraphQLObjectType({
  name: `Post`,
  fields: () => ({
    id: { type: GraphQLID },
    message: { type: GraphQLString },
    authorId: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent)
        return authors.find(item => item.id == parent.authorId)
      },
    },
  }),
})

const AuthorType = new GraphQLObjectType({
  name: `Author`,
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    birthYear: { type: GraphQLInt },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return posts.filter(item => item.authorId === parent.id)
      },
    },
  }),
})

//Корневой запрос

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return posts.find(item => item.id == args.id)
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return authors.find(item => item.id == args.id)
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return posts
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors
      },
    },
  },
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addPost: {
      type: PostType,
      args: {
        message: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const post = {
          id: uuid(),
          message: args.message,
          authorId: args.authorId,
        }
        posts.push(post)
        return post
      },
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        birthYear: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        const newAuthor = {
          id: uuid(),
          name: args.name,
          birthYear: args.birthYear,
        }
        authors.push(newAuthor)
        return newAuthor
      },
    },
  },
})

module.exports = new graphql.GraphQLSchema({
  query: Query,
  mutation: Mutation,
})
