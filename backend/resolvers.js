import { quotes, users } from "./fakedb.js";
import { randomBytes } from "crypto";
import bcrypt from 'bcryptjs';
import jsonwebtoken from "jsonwebtoken";

import { QuoteModel } from "./models/QuoteModel.js";
import { UserModel } from "./models/UserModel.js";

export const resolvers = {
    Query:{
        greet: ()=>{ return "Hello Graphql"; },
        users: async()=>{  return  await UserModel.find({});    },
        user: async (_, args, contextReturnedData )=>{ console.log("contextReturnedData", contextReturnedData);
              return await  UserModel.findOne({_id: contextReturnedData.userId}); },
        quotes: async ()=>{ return await QuoteModel.find({}).populate("by", "_id fname"); },
        iquote: async (_, args)=>{ return await QuoteModel.find({by: args.by}); },
    },
    Mutation:{
        signUpUser: async (_, {newUser})=>{
            const userExist = await UserModel.findOne({email: newUser.email});
            if(userExist){  throw new Error("User Already Exist"); }
            else{
                const hashPass = await bcrypt.hash(newUser.password, 10);
                const doc = {...newUser, password: hashPass};
                const res =await  UserModel.create(doc);
                if(res){return res; }
                else{ throw new Error('Error while Saving Data to Db'); }
            }
        },
        signInUser: async (_, {userSignIn})=>{
            const  userExist = await UserModel.findOne({email: userSignIn.email});
            console.log("userExist", userExist)
            if(userExist){
                const passMatch = await bcrypt.compare(userSignIn.password, userExist.password);
                console.log("passMatch", passMatch)
                if(passMatch){
                    const token = jsonwebtoken.sign({name: userExist.fname, userId: userExist._id}, process.env.JWT_SECRET);
                    return {token};
                }
                else{
                    return new Error('Provide Valid Credentials');
                }
            }
            else{
                throw new Error('User Does not Exist! Please Signup');
            }
        },
        createQuote: async(_, {name}, contextReturnedData)=>{
            console.log("contextReturnedData", contextReturnedData);
            if(contextReturnedData.userId){
                const doc = new QuoteModel({name, by:contextReturnedData.userId});
                const savedQuote = await doc.save();
                return `Quotes Saved Successfully: ${savedQuote._id}`;
            }else{
                 throw new Error('InValid user ! Register or Login First');
            }
        }
    },
    User:{
        quote: async (immediateParentObj)=>{
            return await QuoteModel.find({by:immediateParentObj._id });
        }
    }
}