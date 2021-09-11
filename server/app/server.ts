import express from 'express';
import cors from 'cors'
import MongoHelper from './Helpers/mongo';
import auth_router from './Routes/auth'
const PORT = 5000;
const app = express();

async function main() {
    MongoHelper.connectDb().catch((err) => {
        console.log('unable to connect ');
    });
    app.use(express.json(), cors({ origin: '*' }), auth_router)

    app.listen(PORT, () => {
        console.log('Listening to port ' + PORT);
    })

}
main();