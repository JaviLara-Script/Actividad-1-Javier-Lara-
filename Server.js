require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => console.log('Conectado a MongoDB Atlas'));

// Definir esquema de hábitos
const habitSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  fechaInicio: Date,
  progreso: Number,
});

const Habit = mongoose.model('Habit', habitSchema);

// Rutas CRUD
app.post('/habitos', async (req, res) => {
  const habit = new Habit(req.body);
  await habit.save();
  res.json(habit);
});

app.get('/habitos', async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

app.put('/habitos/:id', async (req, res) => {
  const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(habit);
});

app.delete('/habitos/:id', async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Hábito eliminado' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
