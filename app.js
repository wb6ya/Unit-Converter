import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';

import lengthRouter from './routes/length.js';
import weightRouter from './routes/weight.js';
import temperatureRouter from './routes/temperature.js';

const app = express();
app.use(expressEjsLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

app.get('/', (req, res) => {
  res.render('form', { title: 'Home' });
});

app.use('/length', lengthRouter);
app.use('/weight', weightRouter);
app.use('/temperature', temperatureRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});