//inisalisasi library
const express = require("express")
const app = express()

//import fungsi authorization auth
//const auth = require("./auth")

//import route login
const login = require("./route/login")
app.use("/login", login)

//import route petugas
const petugas = require("./route/petugas")
app.use("/petugas", petugas)

//import route kelas
const kelas = require("./route/kelas")
app.use("/kelas", kelas)

//import route spp
const spp = require("./route/spp")
app.use("/spp", spp)

//import route siswa
const siswa = require("./route/siswa")
app.use("/siswa", siswa)

//import route pembayaran
const pembayaran = require("./route/pembayaran")
app.use("/pembayaran", pembayaran)

//membuat web server dengan port 2000
app.listen(2000, () => {
    console.log("server run on port 2000")
})
