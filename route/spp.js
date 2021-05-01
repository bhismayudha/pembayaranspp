const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") //import konfigurasi database

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// GET: /spp --> end point untuk mengakses data spp
app.get("/", (req,res) => {
    let sql = "select * from spp"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else{
            let response = {
                count: result.length,
                spp: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })    
})

// POST: /spp --> end point untuk pencarian data spp
app.post("/", (req,res) => {
    let find = req.body.find
    let sql = "select * from spp where id_spp like '%"+find+"%' or tahun like '%"+find+"%' or nominal like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                spp: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

// POST: /spp/save --> end point untuk insert data spp
app.post("/save", (req,res) => {
    let data = {
        id_spp: req.body.id_spp,
        tahun: req.body.tahun,
        nominal: req.body.nominal
    }
    let message = ""

    let sql = "insert into spp set ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row inserted"
        }

        let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})

// POST: /spp/update --> end point untuk update data spp
app.post("/update", (req,res) => {
    let data = [{
        id_spp: req.body.id_spp,
        tahun: req.body.tahun,
        nominal: req.body.nominal
    }, req.body.id_spp]
    let message = ""

    let sql = "update spp set ? where id_spp = ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row updated"
        }

        let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})

// DELETE: /spp/:id_spp --> end point untuk hapus data spp
app.delete("/:id_spp", (req,res) => {
    let data = {
        id_spp : req.params.id_spp
    }
    let message = ""
    let sql = "delete from spp where ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row deleted"
        }

        let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})

module.exports = app
