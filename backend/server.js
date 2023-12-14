import {ApolloServer} from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import jsonwebtoken from "jsonwebtoken";
import { Typedefs } from './schema.js';
import { resolvers } from './resolvers.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
const port = process.env.PORT || 4001
if(process.env.NODE_ENV !== 'production'){
    dotenv.config();
}
const app = express();
const httpServer = http.createServer(app);

// this is middleware
const context = ({req})=>{
    const {authorization} = req.headers;
    const { operationName } = req.body;
    if(authorization){
        const {userId=undefined} = jsonwebtoken.verify(authorization, process.env.JWT_SECRET);
        console.log("userId=", userId)
        return {userId};
    }
}

const server = new ApolloServer({
    typeDefs: Typedefs,
    resolvers: resolvers,
    context: context,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer}),
        process.env.NODE_ENV !== 'production'? ApolloServerPluginLandingPageGraphQLPlayground():
        ApolloServerPluginLandingPageDisabled() ]
})

await server.start();
server.applyMiddleware({
    app,
    path: '/graphql'
})

app.get('/', (req, res)=>{
    res.send("Hello User");
    res.end();
})
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then((res)=>{
    console.log("Connected successfully" );
    httpServer.listen({port:port}, ()=>{ console.log("running http")})
    // server.listen(4001).then(res=>{ console.log("res=", res.url)});
}).catch((err)=>{   console.log("Err while connectig: ", err)});