const users = require('../models/user')
const express = require('express');
const router = express.Router()
const userService = require('../services/auth');
const verifyJWt = require('../middleware/verifyJWT');

router.post('/add', verifyJWt, async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ "message": "Parameter missing" })
        }

        const added = await userService.addUser(username, password)
        if (added) {
            return res.status(201).json({ "message": "New User Created" })

        }
        return res.status(500).json({ "message": "Internal Server Error" })
    } catch (error) {
        return res.status(500).json({ "Message:": `Error Occured ${error}` })
    }
})



router.get('/all', verifyJWt, async (req, res) => {
    try {
        const usersl = await users.find().select(' -password')
        if (usersl) {
            return res.status(200).json({ "message": "Search Success", "users": usersl })
        }
        return res.status(404).json({ "message": "no user found" })
    } catch (error) {
        return res.status(500).json({ "Message:": `Error Occured ${error.message}` })
    }
})

router.delete('/remove/:username', verifyJWt, async (req, res) => {
    try {
        const { username } = req.params
        const result = await userService.delUser(username)
        if (result) {
            return res.status(200).json({ message: 'User deleted successfully', result });
        }
        return res.status(500).json({ message: 'User not Deleted', result });
    } catch (error) {
        console.log(error.message)
        res.status(404).json({ message: 'User not Found' });

    }
})
module.exports = router