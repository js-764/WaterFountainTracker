require("dotenv").config();
const express = require("express")
const app = express()

//All the cors stuff to connect to the frontend
const cors = require("cors")
const corsOptions = {
    origin: ["http://localhost:5173"]
}

app.use(cors(corsOptions))

app.use(express.json());

const {Client} = require('pg')

const con = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

con.connect().then(()=> console.log("connected"))

//This doesn't work anymore
// const waterFountainData = {
//     fountains:[{
//         "id":"0",
//         "name":"Water Fountain By The Oval",
//         "locationY":"39.963",
//         "locationX":"-75.176",
//         "status":"Good",
//         "desc":"It works",
//         "date":"7-1-2025",
//         "image_url": "[Good Image]"
//     },
//     {
//         "id":"1",
//         "name":"Philadelphia Water: Water Station #4",
//         "locationY":"39.986",
//         "locationX":"-75.201",
//         "status":"Dirty",
//         "desc":"Someone left trash in the fountain",
//         "date":"8-11-2025",
//         "image_url": "[Photo of trashy fountain]"
//     },
//     {
//         "id":"2",
//         "name":"Locust Street Fountain",
//         "locationY":"39.951",
//         "locationX":"-75.181",
//         "status":"Broken/Not Working",
//         "desc":"Water won't come out",
//         "date":"6-19-2025",
//         "image_url": "[Image of defective fountain]"
//     },
//     {
//         "id":"3",
//         "name":"Lloyd Hall Fountain",
//         "locationY":"39.970",
//         "locationX":"-75.185",
//         "status":"Obstructed",
//         "desc":"There's a bag covering it",
//         "date":"7-2-2025",
//         "image_url": "[Photo with bag over fountain]"
//     },
//     {
//         "id":"4",
//         "name":"Lion's Head Fountain",
//         "locationY":"39.952",
//         "locationX":"-75.191",
//         "status":"Snow/Ice Blocking Access",
//         "desc":"The water fountain is frozen over",
//         "date":"12-4-2024",
//         "image_url": "[Image of the icy fountain]"
//     }]
// }

//This sends the water fountain data to the front end
// app.get("/api", (req, res) => {
//     res.json(waterFountainData)
// })

app.get("/api", (req, res) => {
    

    const fetch_query="SELECT * FROM fountains"
    con.query(fetch_query,(err,result) => {
        if (err)
        {
            res.send("DB get-query failed",err)
            res.sendStatus(500)
        } else {
            res.send(result.rows)
        }
    })
    

    // THE LINE BELOW IS OLD AND SHOULD BE IGNORED
    // res.json(waterFountainData)
})

app.put("/update/:id", (req, res) => {
    const {
        body,
        params: {id}
    } = req;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);

    const status = req.body.fountain_status
    const desc = req.body.fountain_desc
    const lastUpdate = req.body.fountain_date
    const img = req.body.image_url


    // THE LINES COMMENTED OUT BELOW ARE OLD AND SHOULD BE IGNORED
    // waterFountainData.fountains[findFountainIndex] = {
    //     ...waterFountainData.fountains[findFountainIndex],
    //     ...body,
    //     id: parsedId}

    const update_query="UPDATE fountains SET fountain_status=$2, fountain_desc=$3, fountain_date=$4, image_url=$5 WHERE fountain_id=$1"

    con.query(update_query,[parsedId, status, desc,lastUpdate,img], (err,result) => {
        if(err){
            console.error("Database error:",err)
            res.sendStatus(500)
        }

        return res.sendStatus(200);
    })
})


app.listen(8080, () => console.log(`Server is running on port 8080`))