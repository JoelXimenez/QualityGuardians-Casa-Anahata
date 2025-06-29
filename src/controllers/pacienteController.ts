import { RequestHandler } from 'express';
import { 
    registrarPaciente, obtenerPacientesPorInstructor, actualizarPaciente, 
    establecerPasswordPaciente, asignarSerieAPaciente, obtenerSerieAsignada, 
    obtenerHistorialDePaciente, obtenerPacientePorCedula 
} from '../services/pacienteService';

export const crearPacienteHandler: RequestHandler = async (req, res) => {
  try {
    // 1. Obtenemos el ID del instructor desde el token (del usuario autenticado)
    const instructorId = req.user?.id;
    if (!instructorId) {
        return res.status(401).json({ error: 'Instructor no autenticado o token inválido.' });
    }

    // 2. Pasamos tanto los datos del formulario (req.body) como el instructorId al servicio
    const { instructorId: _omit, ...datosPaciente } = { ...req.body };
    const paciente = await registrarPaciente(datosPaciente, instructorId);
    res.status(201).json(paciente);

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
 
export const actualizarPacienteHandler: RequestHandler = async (req, res) => {
  try {
    const pacienteActualizado = await actualizarPaciente(req.params.cedula, req.body);
    res.json({ mensaje: 'Paciente actualizado correctamente', paciente: pacienteActualizado });
  } catch (error: any) {
    if (error.message.includes('encontrado')) return res.status(404).json({ error: error.message });
    res.status(400).json({ error: error.message });
  }
};

export const listarPacientesHandler: RequestHandler = async (req, res) => {
    try {
        const instructorId = req.user?.id;
        if (!instructorId) {
            return res.status(401).json({ error: 'Instructor no autenticado' });
        }
        
        const pacientes = await obtenerPacientesPorInstructor(instructorId);
        // Enviamos la respuesta como JSON. Si la consulta falla, el catch lo manejará.
        res.status(200).json(pacientes);

    } catch (error: any) {
        // Este bloque atrapará el error del servicio y evitará el 'crash' del 500.
        res.status(500).json({ error: "No se pudo obtener la lista de pacientes: " + error.message });
    }
};

export const establecerPasswordPacienteHandler: RequestHandler = async (req, res) => {
  try {
    const { correo, nuevaContraseña } = req.body;
    if (!correo || !nuevaContraseña) return res.status(400).json({ error: 'El correo y la nueva contraseña son obligatorios.' });
    const resultado = await establecerPasswordPaciente(correo, nuevaContraseña);
    res.status(200).json(resultado);
  } catch (error: any) {
    if (error.message.includes("encontró")) return res.status(404).json({ error: error.message });
    res.status(400).json({ error: error.message });
  }
};

export const asignarSerieHandler: RequestHandler = async (req, res) => {
  try {
    const { cedula } = req.params;
    const { serieId } = req.body;
    if (!serieId) return res.status(400).json({ error: 'Se requiere el ID de la serie.' });
    const paciente = await asignarSerieAPaciente(cedula, serieId);
    res.status(200).json({ message: 'Serie asignada correctamente', paciente });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const obtenerMiSerieHandler: RequestHandler = async (req, res) => {
    const pacienteId = req.user?.id;
    if (!pacienteId) return res.status(401).json({ error: 'Token inválido' });
    try {
        const serie = await obtenerSerieAsignada(pacienteId);
        res.status(200).json(serie);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

export const obtenerHistorialHandler: RequestHandler = async (req, res) => {
    const pacienteId = req.params.cedula;
    try {
        const historial = await obtenerHistorialDePaciente(pacienteId);
        res.status(200).json(historial);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

export const obtenerMiHistorialHandler: RequestHandler = async (req, res) => {
    const pacienteId = req.user?.id;
    if (!pacienteId) return res.status(401).json({ error: 'Token inválido' });
    try {
        const historial = await obtenerHistorialDePaciente(pacienteId);
        res.status(200).json(historial);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

export const obtenerPacienteHandler: RequestHandler = async (req, res) => {
    try {
        const paciente = await obtenerPacientePorCedula(req.params.cedula);
        res.status(200).json(paciente);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};