const request = require('supertest');
const app = require('../server');

let token = "";
let memberId = "";
describe('Unit testing role', function(){
  describe('GET /v1/role', function() {
    it('List all roles', function(done) {
      request(app)
      .get('/v1/role')
      .expect(200, done);
    });
  });
  describe('POST /v1/role', function() {
    it('Add a role', function(done) {
      request(app)
      .post('/v1/role')
      .send({ name: "Community Admin" })
      .expect(400, done);
      //expected 400 because I already have Community Admin in role table so cannot be added again.
      //Community Admin, Community Member, Community Moderator are already present to get 200
      //as status code give new name.
    });
  });
});

describe('Unit testing user',function(){
  describe('POST /v1/auth/signup',function(){
    it('Signup user',function(done){
      request(app)
      .post('/v1/auth/signup')
      .send({name:"Lucky",email:"lucky@email.com",password:"Lucky@123"})
      .expect(400,done);
      //if already user exists expect 400 is correct else expect 200 with strong password and correct email format.
    })
  })
  describe('POST /v1/auth/signin',function(){
    it('Signin User',function(done){
      request(app)
      .post('/v1/auth/signin')
      .send({email:"lucky@email.com",password:"Lucky@123"})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        const jsonres = JSON.parse(res.text)
        token = jsonres.content.meta.access_token;
        // console.log(token);
        done();
      });
    })
  })
  describe('GET /v1/auth/me',function(){
    it('Get user details',function(done){
      request(app)
      .get('/v1/auth/me')
      .set('authorization',`Bearer ${token}`)
      .expect(200,done);
    })
  })
})



describe('Unit testing member',function(){
  describe('POST /v1/member',function(done){
    it('Add member',function(done){
      request(app)
      .post('/v1/member')
      .send({community:"7166527060280757988",user:"7166438464105686568",role:"7166135950282104928"})
      .set('authorization',`Bearer ${token}`)
      .expect(200)
      .end(function(err,res){
        if(err) return done(err);
        const jsonres = JSON.parse(res.text);
        memberId = jsonres.content.data.id;
        // console.log(memberId);
        done();
      })
    })
  })

  describe('DELETE /v1/member/:id',function(){
    it('Remove member',function(done){
      request(app)
      .delete('/v1/member/'+memberId)
      .set('authorization', `Bearer ${token}`)
      .expect(200)
      .end(function(err,res){
        if(err) return done(err);
        done();
      })
    })
  })
})


describe('Unit testing community',function(){
  describe('POST /v1/community',function(){
    it('Create community',function(done){
      request(app)
      .post('/v1/community')
      .send({name:"TestCommunity"})
      .set('authorization',`Bearer ${token}`)
      .expect(400,done)
      //as testcommunity already present there will 400 status 
      //if we create new community with new name it gives 200 code
    })
  })

  describe('GET /v1/community',function(){
    it('Get all communities',function(done){
      request(app)
      .get('/v1/community')
      .expect(200,done)
    })
  })

  describe('GET /v1/community/:id/members', () => {
    it('Get all members of given community',function(done){
      request(app)
      .get('/v1/community/testcommunity/members')
      .expect(200,done)
      //by using end(func(err,res)) we can check response also.
    })
  })

  describe('GET /v1/community/me/owner',function(){
    it('Get communities of current user as owner',function(done){
      request(app)
      .get('/v1/community/me/owner')
      .set('authorization',`Bearer ${token}`)
      .expect(200,done)
      //by using end(func(err,res)) we can check response also.
    })
  })

  describe('Get /v1/community/me/member',function(){
    it('Get communities which have current user as member',function(done){
      request(app)
      .get('/v1/community/me/member')
      .set('authorization',`Bearer ${token}`)
      .expect(200,done)
      //by using end(func(err,res)) we can check response also.
    })
  })
})
