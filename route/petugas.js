const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") //import konfigurasi database

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// GET: /petugas --> end point untuk mengakses data petugas
app.get("/",  (req,res) => {
    let sql = "select * from petugas"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else{
            let response = {
                count: result.length,
                petugas: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })    
})

// POST: /petugas --> end point untuk pencarian data petugas
app.post("/",  (req,res) => {
    let find = req.body.find
    let sql = "select * from petugas where id_petugas like '%"+find+"%' or username like '%"+find+"%' or nama_petugas like '%"+find+"%' or level like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                petugas: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

// POST: /petugas/save --> end point untuk insert data petugas
app.post("/save",  (req,res) => {
    let data = {
        id_petugas: req.body.id_petugas,
        username: req.body.username,
        password: md5(req.body.password),
        nama_petugas: req.body.nama_petugas,
        level: req.body.level
    }
    let message = ""

    let sql = "insert into petugas set ?"
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

// POST: /petugas/update --> end point untuk update data petugas
app.post("/update",  (req,res) => {
    let data = [{
        id_petugas: req.body.id_petugas,
        username: req.body.username,
        password: req.body.password,
        nama_petugas: req.body.nama_petugas,
        level: req.body.level
    }, req.body.id_petugas]
    let message = ""

    let sql = "update petugas set ? where id_petugas = ?"
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

// DELETE: /petugas/:id_petugas --> end point untuk hapus data petugas
app.delete("/:id_petugas",  (req,res) => {
    let data = {
        id_petugas : req.params.id_petugas
    }
    let message = ""
    let sql = "delete from petugas where ?"
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



//endpoint histori 
// app.get("/histori", (req,res) => {
//     let sql = "select a.id_pembayaran, b.id_petugas, b.username, b.password, b.nama_petugas, b.level, s.nisn, s.nis, s.nama, s.alamat, s.no_telp, a.tgl_bayar, a.bulan_bayar, a.tahun_bayar, p.id_spp, p.tahun, p.nominal, a.jumlah_bayar " + 
//     "from pembayaran a join petugas b on a.id_petugas = b.id_petugas " +
//     "join siswa s on a.nisn = s.nisn " + 
//     "join spp p on a.id_spp = p.id_spp" 
    
//     db.query(sql, (err, result) => {
//         if (err) {
//             throw err 
//         }
//         else{
//             let response = {
//                 count: result.length,
//                 pembayaran: result
//             }
//             res.setHeader("Content-Type","application/json")
//             res.send(JSON.stringify(response))
//         }
//     })
// })


module.exports = app
