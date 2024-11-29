const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); // Assuming your index.js file is in the root directory
const should = chai.should();

chai.use(chaiHttp);

describe('User Registration and Authentication', () => {
  
  describe('/POST userprofile', () => {
    it('it should register a new user', (done) => {
      let user = {
        first_name: 'John',
        last_name: 'Doe',
        gender: 'Male',
        birthday: '1990-01-01',
        email: 'john.doe@example.com',
        confirmed_password: 'password123'
      };
      chai.request(server)
        .post('/userprofile')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('first_name').eql('John');
          done();
        });
    });

    it('it should not register a user without all fields', (done) => {
      let user = {
        first_name: 'John',
        last_name: 'Doe',
        gender: 'Male',
        email: 'john.doe@example.com',
        confirmed_password: 'password123'
      };
      chai.request(server)
        .post('/userprofile')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('All fields are required');
          done();
        });
    });
  });

  describe('/POST login', () => {
    it('it should login an existing user', (done) => {
      let user = {
        email: 'john.doe@example.com',
        password: 'password123'
      };
      chai.request(server)
        .post('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.should.have.property('email').eql('john.doe@example.com');
          done();
        });
    });

    it('it should not login a user with incorrect credentials', (done) => {
      let user = {
        email: 'john.doe@example.com',
        password: 'wrongpassword'
      };
      chai.request(server)
        .post('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Invalid email or password');
          done();
        });
    });
  });

  describe('/GET userprofile/:id', () => {
    it('it should GET a user profile by the given id', (done) => {
      let userId = 1; // Make sure this ID exists in your database for testing
      chai.request(server)
        .get(`/userprofile/${userId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('first_name');
          res.body.should.have.property('last_name');
          done();
        });
    });
  });
});

describe('Animal Information', () => {
  describe('/GET animals', () => {
    it('it should GET all animals', (done) => {
      chai.request(server)
        .get('/animals')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.above(0);
          done();
        });
    });
  });
});
