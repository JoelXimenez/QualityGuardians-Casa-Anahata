import { registrarInstructor } from '../../services/instructorService';
import { supabase } from '../../config/supabaseClient';
import bcrypt from 'bcrypt';
import { validarContraseña } from '../../utils/validacion';

jest.mock('bcrypt');
jest.mock('../../utils/validacion');

const mockFrom = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  insert: jest.fn().mockReturnThis(),
};

(supabase.from as unknown as jest.Mock) = jest.fn().mockImplementation(() => mockFrom);

describe('registrarInstructor', () => {
  const instructorMock = {
    id: 1,
    nombre: 'Instructor Test',
    correo: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe registrar correctamente al instructor', async () => {
    (validarContraseña as jest.Mock).mockImplementation(() => {});
    mockFrom.single
      .mockResolvedValueOnce({ data: null }) // no existe
      .mockResolvedValueOnce({ data: instructorMock }); // insert exitoso
    (bcrypt.hash as jest.Mock).mockResolvedValue('hash_falsa');

    const resultado = await registrarInstructor('Instructor Test', 'test@example.com', 'claveSegura123');

    expect(resultado).toEqual(instructorMock);
    expect(mockFrom.insert).toHaveBeenCalledWith({
      nombre: 'Instructor Test',
      correo: 'test@example.com',
      contraseña: 'hash_falsa',
    });
  });

  it('debe lanzar error si el correo ya está registrado', async () => {
    (validarContraseña as jest.Mock).mockImplementation(() => {});
    mockFrom.single.mockResolvedValueOnce({ data: { id: 1 } });

    await expect(
      registrarInstructor('Instructor Test', 'test@example.com', 'claveSegura123')
    ).rejects.toThrow('El correo ya está registrado');
  });

  it('debe lanzar error si Supabase falla al insertar', async () => {
    (validarContraseña as jest.Mock).mockImplementation(() => {});
    mockFrom.single
      .mockResolvedValueOnce({ data: null })
      .mockResolvedValueOnce({ data: null, error: { message: 'Fallo' } });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hash_falsa');

    await expect(
      registrarInstructor('Instructor Test', 'test@example.com', 'claveSegura123')
    ).rejects.toThrow('Error al registrar al instructor.');
  });

  it('debe lanzar error si la contraseña es inválida', async () => {
    (validarContraseña as jest.Mock).mockImplementation(() => {
      throw new Error('Contraseña débil');
    });

    await expect(
      registrarInstructor('Instructor Test', 'test@example.com', '123')
    ).rejects.toThrow('Contraseña débil');
  });
});
