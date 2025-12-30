import dotenv from "dotenv";
dotenv.config();

import transporter from "./utils/email.js";


import app from "./app.js";

const PORT = process.env.PORT || 8000;




app.listen(PORT, () => {
    console.log(`🚀 Splitify backend running on port ${PORT}`);

});
