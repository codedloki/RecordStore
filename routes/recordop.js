const express = require('express');
const router = express.Router()
const recordService = require('../services/recordop')
const verifyJWt = require('../middleware/verifyJWT')
const records = require('../models/record')
const csvjson = require("csvjson")


router.post('/add', verifyJWt, async (req, res) => {
    try {
        const { itemName, vehicleno, cusname ,source, destination, amount, qty, date, time } = req.body
        console.log("itemName", itemName, "vehicleno", vehicleno, "source", source, "destination", destination, "amount", amount, "qty", qty, "date", date, "time   ", time)

        console.log(time)
        if (!itemName || !vehicleno || ! cusname || !source || !destination || !amount || !qty || !date || !time) {
            return res.status(404).json({ "message": "All Fields are required" })
        }
        // In routes/recordop.js
        const record = await recordService.addRecord(
            itemName,
            vehicleno,
            cusname,
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


router.get('/all', async (req, res) => {
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




router.get('/export/records',verifyJWt, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="records.csv"'
    );

    const recordsData = await records.find({}).lean();

    // 🔴 THIS PART IS NON-NEGOTIABLE
    const cleanedData = recordsData.map(r => ({
      time: r.time ?? '',
      date: r.date ?? '',
      qty: r.qty != null ? Number(r.qty) : '',
      amount:
        r.amount && typeof r.amount === 'object' && r.amount.toString
          ? Number(r.amount.toString())
          : r.amount ?? '',
      destination: r.destination ?? '',
      source: r.source ?? '',
      cusname: r.cusname ?? '',
      vehicleno: r.vehicleno ?? '',
      itemName: r.itemName ?? ''
    }));

    const csvdata = csvjson.toCSV(cleanedData, {
      headers: [
        'time',
        'date',
        'qty',
        'amount',
        'destination',
        'source',
        'cusname',
        'vehicleno',
        'itemName'
      ]
    });

    return res.status(200).send(csvdata);
  } catch (err) {
    console.error(err);
    return res.status(500).send('CSV export failed');
  }
});

module.exports = router
