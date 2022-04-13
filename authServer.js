require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const {authenticateToken} = require('./middleware/tokenAuthenticate')

app.use(express.json())

let refreshTokenDatabase= []

app.post('/token',(req, res) => {
    const clientRefreshToken = req.body.token
    if(clientRefreshToken==null) return res.sendStatus(401)
    if(!refreshTokenDatabase.includes(clientRefreshToken)) return res.sendStatus(403)
    jwt.verify(clientRefreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user) => {
        if(err){return res.sendStatus(403)}
        const accessToken = generateAccessToken({name:user.name})//10-25minutes
        res.json({accessToken:accessToken})
    })
})

const generateAccessToken = (user)=>{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '20s'})
}
const generateRefreshToken = (user)=>{
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
}

app.post('/login', (req, res) => {
    //Authentication USER
    console.log(req.body)
    const username = req.body.username
    const user = {name:username}
    /*Assumung that the authentication has been 
    completed the JWT.sign should also include the password
    */
   const accessToken = generateAccessToken(user)
   const refreshToken = generateRefreshToken(user)
   refreshTokenDatabase.push(refreshToken)
   res.json({accessToken:accessToken,refreshToken:refreshToken})
})

app.delete('/logout', (req, res) => {
    refreshTokenDatabase = refreshTokenDatabase.filter(token => token !== req.body.token)
    res.sendStatus(204)
})


app.listen(4000,()=>{
    console.log('server listening on port 4000')
})