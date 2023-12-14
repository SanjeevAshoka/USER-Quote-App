import { gql } from "apollo-server-express"

export const Typedefs = gql`
type Quotes{
        name: String!
        by: String!
        }
    type IdName{
        _id: String!
        fname:  String! 
    }
    type QuoteWithName{
        name: String!
        by: IdName
    }
    type User{ 
        _id: ID
        fname: String!
        lname: String!
        email: String!
        quote: [Quotes!]!
        }
    type Query{
        greet: String!
        users: [User]!
        user: User
        quotes: [QuoteWithName]!
        iquote(userId: ID): [Quotes!]
    }
    type Token{
        token: String!
    }
    input UserInput{
        fname: String!
        lname: String!
        email: String!
        password: String!
    }
    input UserLogin{
        email: String!
        password: String!
    }
    type Mutation{
        signUpUser(newUser: UserInput): User!
        signInUser(userSignIn: UserLogin):Token!
        createQuote(name: String!): String!
    }
    `