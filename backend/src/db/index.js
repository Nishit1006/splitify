import mongoose from "mongoose";

console.log("DB NAME:", mongoose.connection.name);
console.log("COLLECTIONS:", Object.keys(mongoose.connection.collections));
