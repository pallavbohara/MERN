// backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//this will be our database structure
const DataSchema = new Schema(
    {
        id: Number,
        message:String
    },
    {
        timestamps:true
    }
);

//export the schema so that we can modify using node.js
module.exports = mongoose.model("Data",DataSchema);