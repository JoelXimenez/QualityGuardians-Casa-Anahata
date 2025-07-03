// src/tests/integration/instructorRoutes.test.ts
import request from 'supertest';
import app from '../../index';
import * as instructorService from '../../services/instructorService';

jest.mock('../../services/instructorService');

describe('POST /api/instructores', () => {
  it('debe registrar un instructor correctamente', async () => {
    const nuevoInstructor = {
      nombre: 'Instructor Test',
      correo: 'test@correo.com',
      contraseña: 'ClaveSegura123',
    };

    const instructorRegistrado = {
      id: 1,
      nombre: 'Instructor Test',
      correo: 'test@correo.com',
    };

    (instructorService.registrarInstructor as jest.Mock).mockResolvedValue(instructorRegistrado);

    const res = await request(app)
      .post('/api/instructores')
      .send(nuevoInstructor);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(instructorRegistrado);
  });
});
