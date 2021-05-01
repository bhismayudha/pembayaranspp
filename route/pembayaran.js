const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") //import konfigurasi database
const moment = require("moment")
const { format } = require("../config")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// GET: /pembayaran --> end point untuk mengakses data pembayaran
app.get("/", (req,res) => {
    let sql = "select a.id_pembayaran, b.id_petugas, b.username, b.password, b.nama_petugas, b.level, s.nisn, s.nis, s.nama, s.alamat, s.no_telp, a.tgl_bayar, a.bulan_bayar, a.tahun_bayar, p.id_spp, p.tahun, p.nominal, a.jumlah_bayar, a.status " + 
    "from pembayaran a join petugas b on a.id_petugas = b.id_petugas " +
    "join siswa s on a.nisn = s.nisn " + 
    "join spp p on a.id_spp = p.id_spp" 
    
    db.query(sql, (err, result) => {
        if (err) {
            throw err 
        }
        else{
            let response = {
                count: result.length,
                pembayaran: result
            }
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

// POST: /pembayaran --> end point untuk pencarian data pembayaran
app.post("/", (req,res) => {
    let find = req.body.find
    let sql = "select * from pembayaran where id_pembayaran like '%"+find+"%' or nisn like '%"+find+"%' or tgl_bayar like '%"+find+"%' or bulan_bayar like '%"+find+"%' or tahun_bayar like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                pembayaran: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

// POST: /pembayaran/save --> end point untuk insert data pembayaran
app.post("/save", (req,res) => {
    let nisn  = req.body.nisn
    let bulan_bayar = req.body.bulan_bayar
    let tahun_bayar = req.body.tahun_bayar
    let message = ""

    let sql = "select * from pembayaran where nisn = '%"+nisn+"%' and bulan_bayar = '%"+bulan_bayar+"%' and tahun_bayar = '%"+tahun_bayar+"%'"
    db.query(sql,(err,result) => {
        if(err) {
            message = err.message
        }
        else {
            message = result
        }
        // else if(result.length > 0) {
        //     message = "Sudah Bayar"
        // }
        // else{
        //     message = "belum bayar"
        //     let data = {
        //         id_pembayaran: req.body.id_pembayaran,
        //         id_petugas: req.body.id_petugas,
        //         nisn: req.body.nisn,
        //         tgl_bayar: moment().format('YYYY-MM-DD HH:mm:ss'),
        //         bulan_bayar: req.body.bulan_bayar,
        //         tahun_bayar: req.body.tahun_bayar,
        //         id_spp: req.body.id_spp,
        //         jumlah_bayar: req.body.jumlah_bayar,
        //         status: req.body.status
        //     }

        //     let sql = "insert into pembayaran set ?"
        //     db.query(sql, data, (err,result) => {
        //         if (err) {
        //             message = err.message
        //         } else {
        //             message = result.affectedRows + " row inserted"
        //         }
        //     })
        // }
        let response = {
            message : message
            }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})

// POST: /pembayaran/update --> end point untuk update data pembayaran
app.post("/update", (req,res) => {
    let data = [{
        id_pembayaran: req.body.id_pembayaran,
        id_petugas: req.body.id_petugas,
        nisn: req.body.nisn,
        tgl_bayar: req.body.tgl_bayar,
        bulan_bayar: req.body.bulan_bayar,
        tahun_bayar: req.body.tahun_bayar,
        id_spp: req.body.id_spp,
        jumlah_bayar: req.body.jumlah_bayar,
        status: req.body.status
    }, req.body.id_pembayaran]
    let message = ""

    let sql = "update pembayaran set ? where id_pembayaran = ?"
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

// DELETE: /pembayaran/:id_pembayaran --> end point untuk hapus data pembayaran
app.delete("/:id_pembayaran", (req,res) => {
    let data = {
        id_pembayaran : req.params.id_pembayaran
    }
    let message = ""
    let sql = "delete from pembayaran where ?"
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
app.get("/histori", (req,res) => {
    let sql = "select a.id_pembayaran, b.id_petugas, s.nisn, s.nama, a.tgl_bayar, a.bulan_bayar, a.tahun_bayar, p.id_spp, p.nominal, a.jumlah_bayar, a.status " + 
    "from pembayaran a join petugas b on a.id_petugas = b.id_petugas " +
    "join siswa s on a.nisn = s.nisn " + 
    "join spp p on a.id_spp = p.id_spp" 
    
    db.query(sql, (err, result) => {
        if (err) {
            throw err 
        }
        else{
            let response = {
                count: result.length,
                pembayaran: result
            }
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

//endpoint histori 
app.get("/histori/:nisn", (req,res) => {
    let nisn = req.params.nisn
    let sql = "select s.nisn, s.nama, a.tgl_bayar, a.bulan_bayar, a.tahun_bayar, p.nominal, a.jumlah_bayar, a.status " + 
    "from pembayaran a " +
    "join siswa s on s.nisn = a.nisn " + 
    "join spp p on a.id_spp = p.id_spp " +
    "where s.nisn = ?"  
    
    db.query(sql, nisn,(err, result) => {
        if (err) {
            throw err 
        }
        else{
            let response = {
                count: result.length,
                pembayaran: result
            }
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

module.exports = app