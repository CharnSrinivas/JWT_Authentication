import { Router, Request } from 'express'
import { Register, Login } from '../models/auth_models';
import MongoHelper from '../Helpers/mongo';

const users = MongoHelper.db?.collection('Users');

const auth_router = Router();
auth_router.post('/register', (req, res) => {
    let body = req.body as Register;
    let d = users?.insertOne(body);
    res.send('success')
    
})

export default auth_router;
