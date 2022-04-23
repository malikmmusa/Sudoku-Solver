const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

const invalidChar = 'x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

const invalidLength = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6....'

const invalidPuzzle = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

chai.use(chaiHttp);

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

var solve
suite('Functional Tests', () => {
  // #1
  test('Solve a puzzle with valid puzzle string', (done) => {
    chai.request(server)
    .post('/api/solve')
    .send({
      puzzle: puzzle
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        solve = res.body.solution
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"solution":"${solve}"}`)
        done()
      }
    })
  })
  // #2
  test('Solve a puzzle with missing puzzle string', (done) => {
    chai.request(server)
    .post('/api/solve')
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"error":"Required field missing"}`)
        done()
      }
    })
  })
  // #3
  test('Solve a puzzle with invalid characters', (done) => {
    chai.request(server)
    .post('/api/solve')
    .send({
      puzzle: invalidChar
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"error":"Invalid characters in puzzle"}`)
        done()
      }
    })
  })
  // #4
  test('Solve a puzzle with incorrect length', (done) => {
    chai.request(server)
    .post('/api/solve')
    .send({
      puzzle: invalidLength
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"error":"Expected puzzle to be 81 characters long"}`)
        done()
      }
    })
  })
  // #5
  test('Solve a puzzle that cannot be solved', (done) => {
    chai.request(server)
    .post('/api/solve')
    .send({
      puzzle: invalidPuzzle
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"error":"Puzzle cannot be solved"}`)
        done()
      }
    })
  })
  // #6
  test('Check a puzzle placement with all fields', (done) => {
    chai.request(server)
    .post('/api/check')
    .send({
      puzzle: puzzle,
      coordinate: 'A1',
      value: 7
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"valid":true}`)
        done()
      }
    })
  })
  // #7
  test('Check a puzzle placement with single placement conflict', (done) => {
    chai.request(server)
    .post('/api/check')
    .send({
      puzzle: puzzle,
      coordinate: 'A1',
      value: '6'
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"valid":false,"conflict":["column"]}`)
        done()
      }
    })
  })
  // #8
  test('Check a puzzle placement with multiple placement conflicts', (done) => {
    chai.request(server)
    .post('/api/check')
    .send({
      puzzle: puzzle,
      coordinate: 'A1',
      value: '1'
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"valid":false,"conflict":["row","column"]}`)
        done()
      }
    })
  })
  // #9
  test('Check a puzzle placement with all placement conflicts', (done) => {
    chai.request(server)
    .post('/api/check')
    .send({
      puzzle: puzzle,
      coordinate: 'A1',
      value: '5'
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"valid":false,"conflict":["row","column","region"]}`)
        done()
      }
    })
  })
  // #10
  test('Check a puzzle placement with missing required fields', (done) => {
    chai.request(server)
    .post('/api/check')
    .send({
      puzzle: puzzle,
      coordinate: 'A1'
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"error":"Required field(s) missing"}`)
        done()
      }
    })
  })
  // #11
  test('Check a puzzle placement with invalid characters', (done) => {
    chai.request(server)
    .post('/api/check')
    .send({
      puzzle: invalidChar,
      coordinate: 'A1',
      value: '7'
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"error":"Invalid characters in puzzle"}`)
        done()
      }
    })
  })
  // #12
  test('Check a puzzle placement with incorrect length', (done) => {
    chai.request(server)
    .post('/api/check')
    .send({
      puzzle: invalidLength,
      coordinate: 'A1',
      value: '7'
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"error":"Expected puzzle to be 81 characters long"}`)
        done()
      }
    })
  })
  // #13
  test('Check a puzzle placement with invalid placement coordinate', (done) => {
    chai.request(server)
    .post('/api/check')
    .send({
      puzzle: puzzle,
      coordinate: 'A0',
      value: '7'
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"error":"Invalid coordinate"}`)
        done()
      }
    })
  })
  // #14
  test('Check a puzzle placement with invalid placement value', (done) => {
    chai.request(server)
    .post('/api/check')
    .send({
      puzzle: puzzle,
      coordinate: 'A1',
      value: 'x'
    })
    .end((err, res) => {
      if (err){
        console.log(err)
      }
      else {
        assert.equal(res.status, 200)
        assert.equal(res.text, `{"error":"Invalid value"}`)
        done()
      }
    })
  })
});

