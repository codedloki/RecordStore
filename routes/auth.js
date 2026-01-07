const express = require('express');
const router = express.Router()
const authService = require('../services/auth')

const jwt = require('jsonwebtoken');
const verifyJWt = require('../middleware/verifyJWT');

router.post('/login', async (req, res) => {
     try {
          const { username, password } = req.body
          const authenticated = await authService.authenticate(username, password)
          if (authenticated) {

               res.status(200).json({ "message": "Login Successful", "token": authenticated })
          } else {
               res.status(401).json({ "message": "Invalid Credentials" })
          }
     } catch (error) {
          console.error(error);

          if (error.message === "User not found") {
               res.status(404).json({ "message": "User not found" })
          }
          else if (error.message === "Invalid credentials") {
               res.status(401).json({ "message": "Invalid Credentials" })
          }
          else {
               res.status(500).json({ "message": "Exception Occurred" });
          }
     }
})




router.get('/user/:userId', verifyJWt, async (req, res) => {
     try {
          const { userId } = req.params
          console.log(userId)
          const user = await authService.getUser(userId)
          console.log(user)
          res.status(200).json({ "user": user })
     } catch (error) {
          res.status(404).json({ "message": "Error Occured" })

     }
})



module.exports = router
