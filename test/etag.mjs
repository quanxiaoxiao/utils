import test from 'ava'; // eslint-disable-line
import { etag, sha256 } from '../src/index.mjs';

test('etag', (t) => {
  const ctx = {
    _etag: null,
    method: 'GET',
    _contentType: null,
    get: (name) => {
      if (name === 'if-none-match') {
        return ctx._etag;
      }
      if (name === 'content-type') {
        return ctx._contentType;
      }
      return null;
    },
    set: (name, value) => {
      if (name === 'etag') {
        ctx._etag = value;
      } else if (name === 'content-type') {
        ctx._contentType = value;
      }
    },
  };
  t.is(etag(ctx, null), null);
  t.is(etag(ctx, ''), null);
  t.is(etag(ctx, 'cqq'), 'cqq');
  t.is(ctx.get('if-none-match'), sha256('cqq'));
  t.is(etag(ctx, 'cqq'), null);
  t.is(ctx.status, 304);
  t.is(etag(ctx, { name: 'cqq' }), JSON.stringify({ name: 'cqq' }));
  t.is(ctx.get('if-none-match'), sha256(JSON.stringify({ name: 'cqq' })));
  t.is(ctx.get('content-type'), 'application/json');
  ctx.status = 200;
  t.is(etag(ctx, { name: 'cqq' }), null);
  t.is(ctx.status, 304);
  ctx.method = 'POST';
  ctx.status = 200;
  etag(ctx, { name: 'cqq' });
  t.true(ctx.status !== 304);
});
