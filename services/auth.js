const { isValidObjectId } = require('mongoose');
const users = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authenticate = async (username, password) => {
    try {
        const user = await users.findOne({ username: username });
        console.log(user);
        if (!user) {
            throw new Error("User not found");
        }
        if (user && await user.comparePassword(password)) {

            const token = jwt.sign({ userId: user._id,role:user.role }, process.env.JWT_SECRET || 'justfuckup', {
                expiresIn: '1h'
            });
            return token;
        }
        throw new Error("Invalid credentials");
    } catch (error) {
        console.error("Authentication error:", error);
        throw error; // Re-throw the error so the calling function can handle it
    }
};



const getUser = async (userId) => {
    try {
        if (!isValidObjectId(userId)) {
            throw new Error("Invalid Object Id")
        }
        const user = await users.findById(userId)
        if (!user) {
            throw new Error("User Not Exist")

        }
        // console.log(user)
        return user.username
    } catch (error) {
        throw error

    }
}



//add users

const addUser = async (username, password) => {
    const user = await users.findOne({ username: username })
    if (!user) {
        try {
            // const salt = await bcrypt.genSalt(10);
            // const newpassword = await bcrypt.hash(password, salt);

            const newUser = new users({
                username: username,
                password: password,
                role: 'user'
            })

            const usr = await newUser.save()
            return usr
        } catch (error) {
            throw new Error(`Error OCcured:${error}`);
        }
    }

    throw new Error("User Already Exists")


}


const delUser = async (username) => {
    const user = await users.findOne({ username: username })
    try {
        if (!user) {
            throw new Error("User not found")
        }
        console.log(user)
        await users.deleteOne({ username: username })
        return "Deleted"
    } catch (error) {
        throw new Error(`Error Occured ${error.message}`)

    }

}


module.exports = {
    authenticate,
    getUser,
    addUser,
    delUser

}
