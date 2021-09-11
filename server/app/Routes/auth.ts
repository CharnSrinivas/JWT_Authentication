import { Router, Request } from 'express'
import { Register, Login } from '../models/auth_models';
import env from 'dotenv'
import MongoHelper from '../Helpers/mongo';
import jwt from 'jsonwebtoken'
import path from 'path'
import { User } from '../models/db_models';
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
env.config({ path: path.join(__dirname, '.env') });
const users = MongoHelper.db!.collection('Users');
const auth_router = Router();
const jwt_secret_key = '123466789'
auth_router.post('/register', (req, res, next) => {
    let body = req.body as Register;
    if (body.username && body.password) {
        if (body.username.length > 5 && body.password.length > 5 && body.username.length < 25) {
            users.findOne({ username: body.username }).then((db_user) => {
                if (db_user) {
                    res.statusMessage = "Username already exists,Please try again!"; res.statusCode = 401;
                    res.send();
                } else {
                    const id = uuid();
                    bcrypt.hash(body.password, 12)
                        .then((password) => {
                            const user: User = {
                                id: id, username: body.username, password: password
                            }
                            users!.insertOne(user, (err, user_document) => {
                                if (err) {
                                    res.statusCode = 500;
                                    res.statusMessage = err.name + "  : " + err.message;
                                    res.send();
                                }

                                const token = jwt.sign(id, jwt_secret_key);
                                res.statusCode = 200;
                                res.setHeader('auth-token', token);
                                res.send(token);
                            })
                        })


                }

            })

        }
        else {
            res.statusMessage = "Invalid email or password"; res.statusCode = 401;
            res.send();
        }
    } else {
        res.statusMessage = "Invalid email or password"; res.statusCode = 401
        res.send();

    }

})

auth_router.post('/login', (req, res) => {
    const token: string | undefined = req.headers['auth-token']?.toString();
    const body = req.body as Login;
    if (token) {
        try {
            const id = jwt.verify(token, jwt_secret_key)
            users.findOne({ id: id, username: body.username }).then((user) => {
                if (user) {
                    res.statusCode = 200;
                    res.send('success');
                } else {
                    res.statusCode = 400;
                    res.statusMessage = "Invalid username or password";
                    res.send();
                }
            })
        }
        catch (err){
            res.statusCode = 500;
            res.statusMessage = "Internal server error";
            res.send('I think jwt manipulated')
        }


    } else {
        res.statusCode = 401;
        res.statusMessage = "Unauthorize access!"
        res.send('no')
    }

})

export default auth_router;
