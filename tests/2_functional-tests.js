const chai = require('chai');
const chaiHttp = require('chai-http');

const { assert } = chai;
const server = require('../server');
const puzzlesAndSolutions = require('../controllers/puzzle-strings');

const puzzleStrings = puzzlesAndSolutions.puzzlesAndSolutions;
chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST /api/solve', () => {
    test('Solve a puzzle with valid puzzle string of 81 characters in length', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzleStrings[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'solution', 'solution should be present');
          assert.equal(res.body.solution, puzzleStrings[0][1]);
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'error', 'error should be present');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('Solve a puzzle with invalid characters', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: `${puzzleStrings[0][0].slice(0, 79)}$#` })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'error', 'error should be present');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Solve a puzzle with incorrect length', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzleStrings[0][0].slice(0, 79) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'error', 'error should be present');
          assert.equal(
            res.body.error,
            'Expected puzzle to be 81 characters long'
          );
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: `${puzzleStrings[0][0].slice(0, 80)}3` })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'error', 'error should be present');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite('POST /api/check', () => {
    test('Check a puzzle placement with all fields', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'valid', 'valid should be present');
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'A2', value: '4' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'valid', 'valid should be present');
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict[0], 'row');
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'C8', value: '2' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'valid', 'valid should be present');
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict[0], 'row');
          assert.equal(res.body.conflict[1], 'region');
          done();
        });
    });

    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'A2', value: '2' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'valid', 'valid should be present');
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict[0], 'column');
          assert.equal(res.body.conflict[1], 'row');
          assert.equal(res.body.conflict[2], 'region');
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'error', 'error should be present');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: `${puzzleStrings[0][0].slice(0, 80)}#`,
          coordinate: 'A2',
          value: '2',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'error', 'error should be present');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: `${puzzleStrings[0][0].slice(0, 80)}`,
          coordinate: 'A2',
          value: '2',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'error', 'error should be present');
          assert.equal(
            res.body.error,
            'Expected puzzle to be 81 characters long'
          );
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStrings[0][0],
          coordinate: 'A^',
          value: '2',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'error', 'error should be present');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'A2', value: '#' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'error', 'error should be present');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});
