import express from 'express';
import cors from 'cors'
import MongoHelper from './Helpers/mongo';
const PORT = 5000;
const app = express();

async function main() {
    await MongoHelper.connectDb().catch((err) => {
        console.log('unable to connect ');
    })
    const auth_router = (await import('./Routes/auth')).default;
    
    app.use(express.json(), cors({ origin: '*' }), auth_router)

    app.listen(PORT, () => {
        console.log('Listening to port ' + PORT);
    })

}
main();