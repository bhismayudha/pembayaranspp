const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") //import konfigurasi database

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// GET: /siswa --> end point untuk mengakses data siswa
app.get("/", (req,res) => {
    //create sql query
    let sql = "select s.nisn, s.nis, s.nama, k.id_kelas, k.nama_kelas, k.kompetensi_keahlian, s.alamat, s.no_telp, p.id_spp, p.tahun, p.nominal, s.username, s.password " +
    "from siswa s join kelas k on s.id_kelas = k.id_kelas " +
    "join spp p on s.id_spp = p.id_spp"

    db.query(sql, (err, result) => {
        if (err) {
            throw err 
        }
        else{
            let response = {
                count: result.length,
                siswa: result
            }
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

// POST: /siswa --> end point untuk pencarian data siswa
app.post("/", (req,res) => {
    let find = req.body.find
    let sql = "select * from siswa where nisn like '%"+find+"%' or nis like '%"+find+"%' or nama like '%"+find+"%' or alamat like '%"+find+"%' or no_telp like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                siswa: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

// POST: /siswa/save --> end point untuk insert data siswa
app.post("/save", (req,res) => {
    let data = {
        nisn: req.body.nisn,
        nis: req.body.nis,
        nama: req.body.nama,
        id_kelas: req.body.id_kelas,
        alamat: req.body.alamat,
        no_telp: req.body.no_telp,
        id_spp: req.body.id_spp,
        username: req.body.username,
        password: req.body.password
    }
    let message = ""

    let sql = "insert into siswa set ?"
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

// POST: /siswa/update --> end point untuk update data siswa
app.post("/update", (req,res) => {
    let data = [{
        nisn: req.body.nisn,
        nis: req.body.nis,
        nama: req.body.nama,
        id_kelas: req.body.id_kelas,
        alamat: req.body.alamat,
        no_telp: req.body.no_telp,
        id_spp: req.body.id_spp,
        username: req.body.username,
        password: req.body.password
    }, req.body.nisn]
    let message = ""

    let sql = "update siswa set ? where nisn = ?"
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

// DELETE: /siswa/:nisn --> end point untuk hapus data siswa
app.delete("/:nisn", (req,res) => {
    let data = {
        nisn : req.params.nisn
    }
    let message = ""
    let sql = "delete from siswa where ?"
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