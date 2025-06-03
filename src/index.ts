import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pacienteRoutes from './routes/pacienteRoutes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
