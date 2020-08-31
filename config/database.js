const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

const dbCtn = mongoose.connection
dbCtn.on('connected', () => console.log(`connected to MongoDB Users at ${dbCtn.host}:${dbCtn.port}`))
dbCtn.on('error', (err) => {
    console.log('Mongo error:' + err)
    mongoose.disconnect()
})
