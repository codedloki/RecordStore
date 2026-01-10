
const records = require('../models/record')

const addRecord = async (itemName, vehicleno, cusname,source, destination, amount, quantity, date, time) => {
    try {
        const record = new records({
            itemName: itemName,
            cusname: cusname,
            vehicleno: vehicleno,
            source: source,
            destination: destination,
            amount: amount,
            qty: quantity,
            date: date,
            time: time

        })
        const rec = await record.save()

        console.log(rec)
        return rec
    } catch (error) {
        console.log(error)
        throw new Error("Error Occured : ", error)
    }


}






module.exports = {
    addRecord
}
