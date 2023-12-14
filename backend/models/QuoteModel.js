import mongoose from "mongoose";

const  QuoteSchema = new mongoose.Schema({
    name: {type: String, required: true},
    by: {type: mongoose.Schema.Types.ObjectId, ref: 'graphqluser'}
});

export const QuoteModel = mongoose.model('graphqlquotes', QuoteSchema);