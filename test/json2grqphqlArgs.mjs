import test from 'ava'; // eslint-disable-line
import { json2graphqlArgs } from '../src/index.mjs';

const wrap = (arr) => ['{', ...arr, '}'].join('\n');

const empty = ['{', '}'].join('\n');

test('json2graphqlArgs', (t) => {
  let ret = json2graphqlArgs();
  t.is(ret, empty);
  ret = json2graphqlArgs(1);
  t.is(ret, empty);
  ret = json2graphqlArgs(null);
  t.is(ret, empty);
  ret = json2graphqlArgs('string');
  t.is(ret, empty);
  ret = json2graphqlArgs(true);
  t.is(ret, empty);
  ret = json2graphqlArgs([]);
  t.is(ret, empty);
  ret = json2graphqlArgs({ name: 'name' });
  t.is(ret, wrap(['name:"name"']));
  ret = json2graphqlArgs({ num: 1 });
  t.is(ret, wrap(['num:1']));
  ret = json2graphqlArgs({ empty: null });
  t.is(ret, wrap(['empty:null']));
  ret = json2graphqlArgs({ bool: true });
  t.is(ret, wrap(['bool:true']));
  ret = json2graphqlArgs({ list: [1] });
  t.is(ret, wrap(['list:[1]']));
  ret = json2graphqlArgs({ list: ['1'] });
  t.is(ret, wrap(['list:["1"]']));
  ret = json2graphqlArgs({ list: [null] });
  t.is(ret, wrap(['list:[null]']));
  ret = json2graphqlArgs({ list: [true] });
  t.is(ret, wrap(['list:[true]']));
  ret = json2graphqlArgs({ fn: () => {} });
  t.is(ret, wrap(['fn:null']));

  ret = json2graphqlArgs({ obj: {} });
  t.is(ret, wrap(['obj:{\n\n}']));
  ret = json2graphqlArgs({ obj: { name: 'name' } });
  t.is(ret, wrap(['obj:{\nname:"name"\n}']));

  ret = json2graphqlArgs({ obj: { name: 'name', age: 22 } });
  t.is(ret, wrap(['obj:{\nname:"name"\nage:22\n}']));

  ret = json2graphqlArgs({ list: [{ name: 'name' }] });
  t.is(ret, wrap(['list:[{\nname:"name"\n}]']));
  ret = json2graphqlArgs({ list: [[]] });
  t.is(ret, wrap(['list:[[]]']));
  ret = json2graphqlArgs({ list: [[{ name: 'name' }]] });
  t.is(ret, wrap(['list:[[{\nname:"name"\n}]]']));
  ret = json2graphqlArgs({ list: [[{ name: 'name', list: [{ age: 22, name: 'cqq' }] }]] });
  t.is(ret, wrap(['list:[[{\nname:"name"\nlist:[{\nage:22\nname:"cqq"\n}]\n}]]']));
});
