const express = require('express');
const bodyParser = require('body-parser')

const router = express.Router();

var db = JSON.parse(fs.readFileSync('db.json'));
db_ctz = db.bnaCitizens;
var len = db_ctz.length

router.use(bodyParser.json())

// get all citizens | GET localhost:3000/citizens
router.get("/", (req, res) => {
    res.send(db_ctz)
})

// get a citizen by id | GET localhost:3000/citizens/$ID
router.get("/:id", (req, res) => {
    var found = false
    db_ctz.forEach(d => {
       if(d.id == req.params.id) {
           found = true
           return res.send(d)
        }
    });
    if(found == false) return res.send(`Cannot find Citizen with ID ${req.params.id}`)
})

// get a citizen's programming language by id | GET localhost:3000/citizens/$ID
router.get("/:id/proficiency/:skill", (req, res) => {
    var found = false
    var skill = req.params.skill

    db_ctz.forEach(d => {
       if(d.id == req.params.id) {
           found = true
           return res.send(d.proficiency[skill])
        }
    });
    if(found == false) return res.send(`Cannot find Citizen with ID ${req.params.id}`)
})

// create a citizen| POST localhost:3000/citizens/
// request body -> {"name":"","languages":[""],"proficiency":[""],"fav_coffee_shop":""}
router.post("/", (req, res) => {
    var body = req.body

    body.id = len + 1
    db.bnaCitizens.push(body)
    fs.writeFileSync('db.json', Buffer.from(JSON.stringify(db, null, 4)))
    return res.send(`Created Citizen with ID: ${body.id}`)
})

// update a citizen by id | PUT localhost:3000/citizens/$ID
// request body -> {"name":"","languages":[""],"proficiency":[""],"fav_coffee_shop":""}
router.put("/:id", (req, res) => {
    var found = false
    var body = req.body
    db_ctz.forEach((d, i) => {
        if(d.id == req.params.id){
            found = true;
            db.bnaCitizens[i] = body;
            db.bnaCitizens[i].id = parseInt(req.params.id);
            fs.writeFileSync('db.json', Buffer.from(JSON.stringify(db, null, 4)))
            return res.send(`Updated Citizen with ID: ${req.params.id}`)
        }
    });
    if(found == false) return res.send(`Cannot find Citizen with ID ${req.params.id}`)
})

// update a key of a citizen by id | PATCH localhost:3000/citizens/$ID?$KEY=$VALUE
router.patch("/:id/", (req, res) => {
    var id = req.params.id;
    var key = Object.keys(req.query)[0];
    var value = req.query[key];
    var found = false
    
    db_ctz.forEach((d, i) => {
        if(d.id == id){
            found = true
            db.bnaCitizens[i][key] = value
            fs.writeFileSync('db.json', Buffer.from(JSON.stringify(db, null, 4)))
            return res.send(`Updated Citizen with ID: ${id}`)
        }
    });
    if(found == false) return res.send(`Cannot find Citizen with ID ${id}`)
})

// delete a citizen by id| DELETE localhost:3000/citizens/$ID
// request body -> {"name":"","languages":[""],"proficiency":[""],"fav_coffee_shop":""}
router.delete("/:id", (req, res) => {
    var found = false
    var id = req.params.id

    db_ctz.forEach((d,i) => {
       if(d.id == id) {
           found = true
           db.bnaCitizens.splice(i, 1);
           fs.writeFileSync('db.json', Buffer.from(JSON.stringify(db, null, 4)))
           return res.send(`Successfully deleted Citizen with id ${id}`)
        }
    });
    if(found == false) return res.send(`Cannot find Citizen with ID ${id}`)
})

module.exports = router;