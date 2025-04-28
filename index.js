import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {checkLoggedIn, bypassLogin} from './middlewares/middleware.js';

dotenv.config();


const prisma = new PrismaClient();

const app = express()

app.set('view engine', "ejs")

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    name: 'session_auth_example'
}))

app.use(express.urlencoded({extended:false}))

app.get('/', checkLoggedIn, (req, res)=>{
    res.render('home', {user: req.session.user.username})
})
app.get('/login', bypassLogin, (req, res)=>{
    res.render('login', {error:null})
})
app.post('/login', async (req, res)=>{
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (user && await bcrypt.compare(password, user.password)) {
        await prisma.session.create({
        data: {
            userId: user.id,
            sessionId: req.sessionID,
            data: { username: user.username },
        },
        });

        req.session.user = { id: user.id, username: user.username };
        res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
})

app.get('/logout', async (req, res)=>{
    if (req.session.user) {
        await prisma.session.deleteMany({ where: { userId: req.session.user.id } });
      }
      req.session.destroy(() => {
        res.clearCookie('session_auth_example');
        res.redirect('/');
      });
})

app.get('/register', (req, res)=>{
    res.render('register', {error: null})
})

app.post('/register', async (req, res)=>{
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data:{
                username, email, password: hashedPassword
            },
        })
        req.session.user = { id: user.id, username: user.username };
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('register', { error: 'User already exists' }); 
    }

})

app.listen(3000,()=>{
    console.log('server started on http://localhost:3000')
})