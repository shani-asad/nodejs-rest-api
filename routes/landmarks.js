const express = require('express');
const bodyParser = require('body-parser')

const router = express.Router();

var db = JSON.parse(fs.readFileSync('db.json'));
db_lnm = db.bnaLandmarks;
var len = db_lnm.length

router.use(bodyParser.json())

// get all landmarks | GET localhost:3000/landmarks
router.get("/", (req, res) => {
    res.send(db_lnm)
})

// get a landmark by id | GET localhost:3000/landmarks/$ID
router.get("/:id", (req, res) => {
    var found = false
    db_lnm.forEach(d => {
       if(d.id == req.params.id) {
           found = true
           return res.send(d)
        }
    });
    if(found == false) return res.send(`Cannot find Landmark with ID ${req.params.id}`)
})

// create a landmark| POST localhost:3000/landmarks/
// request body -> {"name": "","ticket_price": "","description": ""}
router.post("/", (req, res) => {
    var body = req.body

    body.id = len + 1
    db.bnaLandmarks.push(body)
    fs.writeFileSync('db.json', Buffer.from(JSON.stringify(db, null, 4)))
    return res.send(`Created Landmark with ID: ${body.id}`)
})

// update a landmark by id | PUT localhost:3000/landmarks/$ID
// request body -> {"name": "","ticket_price": "","description": ""}
router.put("/:d", (req, res) => {
    var found = false
    var body = req.body
    db_lnm.forEach((d, i) => {
        if(d.id == req.params.id){
            found = true;
            db.bnaLandmarks[i] = body
            db.bnaCitizens[i].id = parseInt(req.params.id);
            fs.writeFileSync('db.json', Buffer.from(JSON.stringify(db, null, 4)))
            return res.send(`Updated Landmark with ID: ${req.params.id}`)
        }
    });
    if(found == false) return res.send(`Cannot find Landmark with ID ${req.params.id}`)
})

// update a key of a landmark by id | PATCH localhost:3000/landmarks/$ID?$KEY=$VALUE
router.patch("/:id/", (req, res) => {
    var id = req.params.id;
    var key = Object.keys(req.query)[0];
    var value = req.query[key];
    var found = false
    
    db_lnm.forEach((d, i) => {
        if(d.id == id){
            found = true
            db.bnaLandmarks[i][key] = value
            fs.writeFileSync('db.json', Buffer.from(JSON.stringify(db, null, 4)))
            return res.send(`Updated Landmark with ID: ${id}`)
        }
    });
    if(found == false) return res.send(`Cannot find Landmark with ID ${id}`)
})

// delete a landmark by id| DELETE localhost:3000/landmarks/$ID
// request body -> {"name": "","ticket_price": "","description": ""}
router.delete("/:id", (req, res) => {
    var found = false
    var id = req.params.id

    db_lnm.forEach((d,i) => {
       if(d.id == id) {
           found = true
           db.bnaLandmarks.splice(i, 1);
           fs.writeFileSync('db.json', Buffer.from(JSON.stringify(db, null, 4)))
           return res.send(`Successfully deleted Landmark with id ${id}`)
        }
    });
    if(found == false) return res.send(`Cannot find Landmark with ID ${id}`)
})

module.exports = router;