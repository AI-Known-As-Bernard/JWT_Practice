require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const {authenticateToken} = require('./middleware/tokenAuthenticate')

app.use(express.json())

const serverData =[
    {
        username: 'Mermaidman',
        secret: 'Never wore boxers'
    },{
        username: 'Bernard',
        secret: 'Instructor'
    },{
        username: 'Andi',
        secret: 'Tool'
    },{
        username: 'Patty',
        secret: 'Burger'
    }
]


app.get('/posts',authenticateToken, (req, res) => {
    res.json(serverData.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    //Authentication USER
    console.log(req.body)
    const username = req.body.username
    const user = {name:username}
    /*Assumung that the authentication has been 
    completed the JWT.sign should also include the password
    */
   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
   res.json({accessToken:accessToken})
})


app.listen(5000,()=>{
    console.log('server listening on port 5000')
})