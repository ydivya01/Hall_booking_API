require ("dotenv").config();
const express = require("express");
const mongoose = require ("mongoose");
const {dbURL} = require('./db');
const HallBook = require ("./schema");


const app = express();

mongoose.connect(dbURL);

const home = `
 Hall Booking API
 GET - /hall-details
 POST - /new-hall
 PUT - /book-hall/:id`

app.get('/', (req, res)=>{
    res.send(home)
})

app.listen(process.env.PORT, ()=>{
    console.log(`App listening on port ${process.env.PORT}`)
})

app.use(express.json());

// All hall details

app.get('/hall-details', async function(req, res){
    const result = await HallBook.find({})
    res.send(result);
})

// New hall insert

app.post('/new-hall', async (req, res)=>{
    try{
        const newHall = await HallBook.create({
            noOfSeats :req.body.noOfSeats,
            amenities :req.body.amenities,
            price :req.body.price,
            ifBooked : req.body.ifBooked,
            customerName :req.body.customerName,
            date: req.body.date,
            startTime : req.body.startTime,
            endTime :req.body.endTime,
            roomId : req.body.roomId,
            roomName : req.body.roomName
        })
        res.status(201).send({
            messafe : "Hall created successfully"
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({
            message : "Internal server error"
        })
    }
});

app.put('/book-hall/:id', async (req, res)=>{
    const halls = await HallBook.findOne({_id:req.params.id});

    if(halls.ifBooked === 'true'){
        return res.status(400).send({
            message : 'Hall is already booked'
        })}
        else
        {
            halls.date = req.body.date
            halls.startTime = req.body.startTime
            halls.endTime = req.body.endTime
            halls.customerName = req.body.customerName
            halls.ifBooked = 'true'

            await halls.save();

            return res.status(200).send({
                message : 'Hall is booked'
            })
        }
    });