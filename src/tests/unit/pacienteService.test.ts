import { registrarPaciente } from '../../services/pacienteService';

jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null }), // Simula que no existe ni correo ni cédula
    insert: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          cedula: '1234567890',
          nombre: 'Juan Pérez',
          correo: 'juan@correo.com'
        }
      }),
      error: null
    })
  }
}));

describe('registrarPaciente', () => {
  it('debería registrar un nuevo paciente si no existe correo ni cédula', async () => {
    const datosPaciente = {
      nombre: 'Juan Pérez',
      correo: 'juan@correo.com',
      telefono: '0999999999',
      fechaNacimiento: '1990-01-01',
      genero: 'M',
      observaciones: '',
      instructorId: '' 
    };

    const paciente = await registrarPaciente(datosPaciente, 'instructor-123');

    expect(paciente).toHaveProperty('cedula', '1234567890');
    expect(paciente.nombre).toBe('Juan Pérez');
  });
});
