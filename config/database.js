const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

const dbCtn = mongoose.connection
dbCtn.on('connected', () => console.log(`connected to MongoDB Users at ${dbCtn.host}:${dbCtn.port}`))
// const closeAll = () => {
//     dbCtn.close()
//     closeAll()
// }
// closeAll()

// const dbTwos = mongoose.createConnection(process.env./*--your typetwo MongoDB URI name from .env---*/, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

// dbTwos.on('connected', () => console.log(`connected to MongoDB Twos at ${dbTwos.host}:${dbTwos.port}`))
