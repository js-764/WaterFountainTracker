require("dotenv").config();
const express = require("express")
const app = express()

app.use(express.json());

const {Client} = require('pg')

const path = require("path");

//All the cors stuff to connect to the frontend
const cors = require("cors")
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://jade-capybara-cb936a.netlify.app"
    ]
}

app.use(cors(corsOptions))

const con = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        //needed for railway
        rejectUnauthorized: false,
    },
})

con.connect()
    .then(()=> console.log("connected railway to postgresql"))
    .catch((err) => console.error("Database connection error:",err))

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

// This sends the water fountain data to the front end
// app.get("/api", (req, res) => {
//     res.json(waterFountainData)
// })

// THE LINE BELOW IS OLD AND SHOULD BE IGNORED
// res.json(waterFountainData)


//get fountains
app.get("/api", async (req, res) => {
    
    try {
        const { rows } = await client.query("SELECT * FROM fountains");
        res.json({ fountains: rows });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})
    
// Update a fountain based on its ID
app.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const parsedId = parseInt(id);
        if (isNaN(parsedId)) {
            return res.status(400).send("Invalid ID");
        }

        const { fountain_status, fountain_desc, fountain_date, image_url } = req.body;

        const update_query = `
            UPDATE fountains 
            SET fountain_status = $2, 
                fountain_desc = $3, 
                fountain_date = $4, 
                image_url = $5 
            WHERE fountain_id = $1
        `;

        await con.query(update_query, [parsedId, fountain_status, fountain_desc, fountain_date, image_url]);

        res.sendStatus(200);
    } catch (err) {
        console.error("Database error:", err);
        res.sendStatus(500);
    }
})

// //OLD APP.PUT() METHOD
// app.put("/update/:id", (req, res) => {
//     const {
//         body,
//         params: {id}
//     } = req;

//     const parsedId = parseInt(id);
//     if (isNaN(parsedId)) return response.sendStatus(400);

//     const status = req.body.fountain_status
//     const desc = req.body.fountain_desc
//     const lastUpdate = req.body.fountain_date
//     const img = req.body.image_url


//     // THE LINES COMMENTED OUT BELOW ARE OLD AND SHOULD BE IGNORED
//     // waterFountainData.fountains[findFountainIndex] = {
//     //     ...waterFountainData.fountains[findFountainIndex],
//     //     ...body,
//     //     id: parsedId}

//     const update_query="UPDATE fountains SET fountain_status=$2, fountain_desc=$3, fountain_date=$4, image_url=$5 WHERE fountain_id=$1"

//     con.query(update_query,[parsedId, status, desc,lastUpdate,img], (err,result) => {
//         if(err){
//             console.error("Database error:",err)
//             res.sendStatus(500)
//         }

//         return res.sendStatus(200);
//     })
// })

app.get("/", (req, res) => {
  res.send("Backend server is running. Frontend coming soon!");
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(8080, () => console.log(`Server is running on port 8080`))