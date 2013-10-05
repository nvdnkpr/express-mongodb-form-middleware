var request = require('supertest');
var express = require('express');
var FormMiddleware = require('../');
var expressValidator = require('express-validator');
var should = require('should');

var viewPath = 'form';
var selectOptions = ['Yes', 'No', 'Maybe'];

var stubMiddleware = function(req, res, next) {
  req.testObj = {
    id: 1,
    save: function(cb) { // stub out a save method
      return cb(null, this);
    }
  };
  return next();
};


describe('select form-controller tests', function() {

  it('respond with html', function(done) {

    var app = express();
    app.set("views", __dirname + "/views");
    app.set('view engine', 'jade');
    app.set('view options', {
      doctype: 'html'
    });

    var fm = new FormMiddleware()
      .viewPath(viewPath)
      .field({type: 'select', name: 'testField', options: selectOptions })
      .validator({fn: 'notEmpty', param: 'testField', msg: 'Test field cannot be empty'})
      .validator({fn: 'isIn', param: 'testField', msg: 'Valid option required', }, selectOptions)
      .save('testField', function(req, res) { return req.testObj })
      .next(function(savedObj, req, res, next) {return res.redirect('/' + savedObj.id); })

    var m = fm.middleware();

    app.get('/', stubMiddleware, m.render);

    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('respond with redirect', function(done) {

    var app = express();
    app.set("views", __dirname + "/views");
    app.set('view engine', 'jade');
    app.set('view options', {
      doctype: 'html'
    });

    app.use(express.bodyParser());
    app.use(expressValidator());
    app.use(express.methodOverride());

    var fm = new FormMiddleware()
      .viewPath(viewPath)
      .field({
        type: 'select',
        name: 'testField',
        options: selectOptions
      })
      .validator({
        fn: 'notEmpty',
        param: 'testField',
        msg: 'Test field cannot be empty'
      })
      .validator({
        fn: 'isIn',
        param: 'testField',
        msg: 'Valid option required',
      }, selectOptions)
      .save('testField', function(req, res) {
        return req.testObj
      })
      .next(function(savedObj, req, res, next) {
        return res.redirect('/' + savedObj.id);
      }).middleware();

    app.post('/', stubMiddleware, fm.validateAndSave);

    request(app)
      .post('/')
      .end(function(err, res) {
        res.statusCode.should.equal(302);
        res.headers.should.have.property('location', '/1');
        done();
      })
  });
});


describe('input form-controller tests', function() {

  it('respond with html', function(done) {

    var app = express();
    app.set("views", __dirname + "/views");
    app.set('view engine', 'jade');
    app.set('view options', {
      doctype: 'html'
    });

    var fm = new FormMiddleware()
      .viewPath(viewPath)
      .field({
        type: 'input',
        name: 'testField',
        options: selectOptions
      })
      .validator({
        fn: 'notEmpty',
        param: 'testField',
        msg: 'Test field cannot be empty'
      })
      .save('testField', function(req, res) {
        return req.testObj
      })
      .next(function(savedObj, req, res, next) {
        return res.redirect('/' + savedObj.id);
      })

    var m = fm.middleware();

    app.get('/', stubMiddleware, m.render);

    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('respond with redirect', function(done) {

    var app = express();
    app.set("views", __dirname + "/views");
    app.set('view engine', 'jade');
    app.set('view options', {
      doctype: 'html'
    });

    app.use(express.bodyParser());
    app.use(expressValidator());
    app.use(express.methodOverride());

    var fm = new FormMiddleware()
      .viewPath(viewPath)
      .field({
        type: 'input',
        name: 'testField',
        options: selectOptions
      })
      .validator({
        fn: 'notEmpty',
        param: 'testField',
        msg: 'Test field cannot be empty'
      })
      .save('testField', function(req, res) {
        return req.testObj
      })
      .next(function(savedObj, req, res, next) {
        return res.redirect('/' + savedObj.id);
      }).middleware();

    app.post('/', stubMiddleware, fm.validateAndSave);

    request(app)
      .post('/')
      .end(function(err, res) {
        res.statusCode.should.equal(302);
        res.headers.should.have.property('location', '/1');
        done();
      })
  });
});