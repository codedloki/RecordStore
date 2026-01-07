const express = require('express');
const router = express.Router()
const recordService = require('../services/recordop')
const verifyJWt = require('../middleware/verifyJWT')
const records = require('../models/record')

router.post('/add', verifyJWt, async (req, res) => {
    try {
        const { itemName, vehicleno, source, destination, amount, qty, date, time } = req.body
        console.log("itemName", itemName, "vehicleno", vehicleno, "source", source, "destination", destination, "amount", amount, "qty", qty, "date", date, "time   ", time)

        console.log(time)
        if (!itemName || !vehicleno || !source || !destination || !amount || !qty || !date || !time) {
            return res.status(404).json({ "message": "All Fields are required" })
        }
        // In routes/recordop.js
        const record = await recordService.addRecord(
            itemName,
            vehicleno,
            source,
            destination,
            amount,
            qty,
            date,
            time
        );

        console.log("At Route :", record)
        if (record) {
            return res.status(201).json({ "message": "Record Added Successfully", "details": record })
        }

    } catch (error) {
        console.error(error)
        return res.status(501).json({ "message": "Failed TO add new Record" })

    }
})


router.get('/all', verifyJWt, async (req, res) => {
    try {
        // Fetch actual results with await
        const recors = await records.find({});


        return res.status(200).json({
            message: "Records Retrieved Successfully",
            records: recors
        });
    } catch (error) {
        console.error("❌ Error Retrieving Records:", error);
        return res.status(500).json({
            message: "Error Retrieving Records",
            error: error.message
        });
    }
});
module.exports = router