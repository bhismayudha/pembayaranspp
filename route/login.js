const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") //import konfigurasi database
const md5 = require("md5")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyenangkan"
const auth = require("../auth") 

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// endpoint login siswa
app.post("/siswa", (req, res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]
    let sql = "select * from siswa where username = ? and password = ?"
    db.query(sql, param, (error, result) => {
        if(error) throw error

        if (result.length > 0) {
            let payload = JSON.stringify(result[0].nisn)
            let token = jwt.sign(payload, SECRET_KEY)
            res.json({
                logged: true,
                data: result,
                token: token
            })
        } else {
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})

// endpoint login petugas 
app.post("/petugas", (req, res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]
    let sql = "select * from petugas where username = ? and password = ?"
    db.query(sql, param, (error, result) => {
        if(error) throw error

        if (result.length > 0) {
            let payload = JSON.stringify(result[0].id_petugas)
            let token = jwt.sign(payload, SECRET_KEY)
            res.json({
                logged: true,
                data: result,
                token: token
            })
        } else {
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})

module.exports = app