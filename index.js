import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';


dotenv.config();
dotenv.config({ path: '.env.example' });


const app = express()

app.set('view engine', "ejs")

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    name: 'session_auth_example'
}))

app.use(express.urlencoded({extended:false}))

app.get('/', (req, res)=>{
    res.render('home')
})
app.get('/login', (req, res)=>{
    res.render('login', {error:null})
})
app.post('/login', (req, res)=>{
    //logic to verify user creds
    if(req.body.username ==='john' && req.body.password === '123'){
        //create session & store user logged details
        req.session.user = {id: 1, username: 'john', name: 'John Pork'}
        res.redirect('/')
    } else {
        res.render('login', {error: 'Wrong Credentials'})
    }
})

app.listen(3000,()=>{
    console.log('server started on http://localhost:3000')
})