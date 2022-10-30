import test from 'ava'; // eslint-disable-line
import Semaphore from '../src/semaphore.mjs';

test('Semaphore', (t) => {
  t.plan(2);
  const sem = new Semaphore(1);
  sem.acquire(() => {
    t.pass();
    sem.release();
  });
  sem.acquire(() => {
    t.pass();
    sem.release();
  });
});
