const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT;
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  console.log('connected to MongoDB')
}).catch(error => {
  console.log('error connecting to MongoDB:', error.message)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});