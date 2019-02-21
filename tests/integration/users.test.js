const request = require('supertest');
const { User } = require('../../server/models/user');
const bcrypt  = require('bcryptjs');

describe('/users', () => {
  let server;
  
  beforeEach(() => {
    server = require('../../server/app');
  });
  afterEach(async () => { 
    await server.close();
    await User.remove({});
  });

  describe('GET /users', () => {
    beforeEach(async () => {
      await User.insertMany([
        { name: 'user1', email: 'email1', type: 'type', password: 'pass1' },
        { name: 'user2', email: 'email2', type: 'type', password: 'pass2' },
        { name: 'other3', email: 'email3', type: 'type3', password: 'pass3' }
      ]);
    });

    it('it should return all users if page and limit are not specified', async () => {
      const res = await request(server).get('/users')

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some(user => user.email === 'email1')).toBeTruthy();
      expect(res.body.some(user => user.email === 'email2')).toBeTruthy();
    });

    it('should return users who match the incomplete name parameter', async () => {
      const res = await request(server)
        .get('/users')
        .query({ name: 'user' });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.every(user => user.name.match('user'))).toBeTruthy();
    });

    it(`should return users according to the quantity and 
        page specified by the parameters limit and page`, async () => {
      const res = await request(server)
        .get('/users')
        .query({ limit: 1, page: 1 });

      expect(res.status).toBe(200);
      expect(res.body.docs.length).toBe(1);
      expect(res.body.docs.some(user => user.email === 'email1')).toBeTruthy();
    });

    it('should return a 400 error if page is specified but limit is not', async () => {
      const res = await request(server)
        .get('/users')
        .query({ page: 1 })

      expect(res.status).toBe(400);
    });
  });


  describe('GET /users/:id', () => {
    it('should return a user if valid id is passed', async () => {
      const user = new User({
        name: 'user',
        email: 'email',
        type: 'type',
        password: 'pass'
      });
      await user.save();

      const res = await request(server).get(`/users/${user._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', user.email);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /users/register', () => {
    let user;

    beforeEach(() => {
      user = {
        name: 'user',
        email: 'email',
        type: 'type',
        password: 'pass'
      };
    })

    const exec = () => {
      return request(server)
        .post('/users/register')
        .send(user);
    }

    it('should save the user and encrypt the password if user is valid', async () => {
      await exec();
      const res = await User.findOne({ email: 'email' })

      expect(res).not.toBeNull();
      expect(res.password.length).toBe(60);
    });

    it('should return the user with omited password if it is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', user.email);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 400 if user already exists', async () => {
      await User.insertMany([ user ]);
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is not provided', async () => {
      user.name = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
      user.email = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });
    
    it('should return 400 if type is not provided', async () => {
      user.type = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      user.password = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
