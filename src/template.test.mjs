import test from 'node:test';
import assert from 'node:assert';
import template from './template.mjs';

test('template', () => {
  assert.equal(template()(), '');
  assert.equal(template('aaa')(), 'aaa');
  assert.equal(template('a{aa')(), 'a{aa');
  assert.equal(template('a{{aa')(), 'a{{aa');
  assert.equal(template('a{{a}a')(), 'a{{a}a');
  assert.equal(template('aa}}a')(), 'aa}}a');
  assert.equal(template('a{{a}}a')(), 'aa');
  assert.equal(template('a{{ }}a')({}), 'aa');
  assert.equal(template('a{{}}a')({}), 'aa');
  assert.equal(template('a{{ a }}a')({}), 'aa');
  assert.equal(template('a{{.}}a')('999'), 'a999a');
  assert.equal(template('a{{ . }}a')('999'), 'a999a');
  assert.equal(template('a{{}}a')('999'), 'a999a');
  assert.equal(template('a{{}}a')(12334), 'a12334a');
  assert.equal(template('a{{}}a')(false), 'afalsea');
  assert.equal(template('a{{}}a')(true), 'atruea');
  assert.equal(template('a{{a}}a')({ a: 'bbb' }), 'abbba');
  assert.equal(template('a{{a}}aeee\\{{aa')({ a: 'bbb' }), 'abbbaeee{{aa');
  assert.equal(template('a{{ a }}a')({ a: 'bbb' }), 'abbba');
  assert.equal(template('a{{ obj.name }}a')({ a: 'bbb', obj: { name: 'quan' }  }), 'aquana');
  assert.equal(template('a{{a}}ac{{b}}d')({ a: '111', b: '222' }), 'a111ac222d');
  assert.equal(template('a\\{\\{a}}ac{{b}}d')({ a: '111', b: '222' }), 'a{{a}}ac222d');
  assert.equal(template('a\\{\\{a\\}\\}ac{{b}}d')({ a: '111', b: '222' }), 'a{{a}}ac222d');
  assert.equal(template('a\\{{{a}}ac{{b}}d')({ a: '111', b: '222' }), 'a{111ac222d');
  assert.equal(template('a{\\{{a}}ac{{b}}d')({ a: '111', b: '222' }), 'a{{{a}}ac222d');
  assert.equal(template('a{{a}}a', (s) => encodeURIComponent(s))({ a: 'bb s,' }), `a${encodeURIComponent('bb s,')}a`);
  assert.equal(template('a{{"good"}}a')(), 'agooda');
  assert.equal(template('a{{"go\\{{od"}}a')(), 'ago{{oda');
  // assert.equal(template('a{{"go\\}}od"}}a')(), 'ago}}oda');
  assert.equal(template('a{{\'good\'}}a')(), 'agooda');
  assert.equal(template('a{{""}}a')(), 'aa');
  assert.equal(template(`a{{''}}a`)(), 'aa');
  assert.equal(template(`a{{"go\\"od"}}a`)(), 'ago"oda');
  assert.equal(template(`a{{'go\\'od'}}a`)(), 'ago\'oda');
  assert.equal(template('a{{name}}{{foo}}{{bar}}a')({ name: '123', foo: '789', bar: 999 }), 'a123789999a');
});

test('template 22', () => {
  const data = {
    test: {
      key: 'name',
    },
    obj: {
      name: 'ccc',
    },
    quan: {
      big: {
        ss: '999',
      },
    },
    quanName: 'ss',
    foo: 'bar',
  };
  assert.equal(template('aaa{{obj[test.key]}}')(data), 'aaaccc');
  assert.equal(template('aaa{{ obj[test.key]}}')(data), 'aaaccc');
  assert.equal(template('aaa{{ obj[test.key] }}ss')(data), 'aaacccss');
  assert.equal(template('aaa{{obj[ test.key]}}')(data), 'aaaccc');
  assert.equal(template('aaa{{obj[test.key ]}}')(data), 'aaaccc');
  assert.equal(template('aaa{{obj[ test.key ]}}')(data), 'aaaccc');
  assert.equal(template('aaa{{obj[sss.keys]}}')(data), 'aaa');
  assert.equal(template('aaa{{data[test.key]}}')(data), 'aaa');
  assert.equal(template('aaa{{quan.big[quanName]}}xxx')(data), 'aaa999xxx');
});
