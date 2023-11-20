const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vishwahegdek:oHFrZQaRhka65aQl@cluster0.dj4mlzp.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


