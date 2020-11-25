import request from 'supertest';
import { app } from '../../app';

// it('returns a 201 on successful signin', async () => {
//   return request(app)
//     .post('/api/users/signin')
//     .send({
//       email: 'test@test.com',
//       password: 'password'
//     })
//     .expect(201);
// });

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'alskdflaskjfd',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: ''
    })
    .expect(400);
});

it('returns a 400 with an account that doesnt"t exist', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: ''
    })
    .expect(400);
});

it('incorrect passwordt', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

    await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'fsdfs'
    })
    .expect(400);
});

it('correct passwordt', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

    const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined()
});

