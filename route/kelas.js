const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") //import konfigurasi database

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// GET: /kelas --> end point untuk mengakses data kelas
app.get("/", (req,res) => {
    let sql = "select * from kelas"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else{
            let response = {
                count: result.length,
                kelas: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })    
})

// POST: /kelas --> end point untuk pencarian data kelas
app.post("/", (req,res) => {
    let find = req.body.find
    let sql = "select * from kelas where id_kelas like '%"+find+"%' or nama_kelas like '%"+find+"%' or kompetensi_keahlian like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                kelas: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

// POST: /kelas/save --> end point untuk insert data kelas
app.post("/save", (req,res) => {
    let data = {
        id_kelas: req.body.id_kelas,
        nama_kelas: req.body.nama_kelas,
        kompetensi_keahlian: req.body.kompetensi_keahlian
    }
    let message = ""

    let sql = "insert into kelas set ?"
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

// POST: /kelas/update --> end point untuk update data kelas
app.post("/update", (req,res) => {
    let data = [{
        id_kelas: req.body.id_kelas,
        nama_kelas: req.body.nama_kelas,
        kompetensi_keahlian: req.body.kompetensi_keahlian
    }, req.body.id_kelas]
    let message = ""

    let sql = "update kelas set ? where id_kelas = ?"
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

// DELETE: /kelas/:id_kelas --> end point untuk hapus data kelas
app.delete("/:id_kelas", (req,res) => {
    let data = {
        id_kelas : req.params.id_kelas
    }
    let message = ""
    let sql = "delete from kelas where ?"
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
