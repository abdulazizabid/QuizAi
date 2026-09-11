const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

function setup({ badCounts = false, failAttemptOnce = false } = {}) {
  const elements = new Map();
  const storage = () => {
    const data = new Map();
    return { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  };
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      value: ({ mcqCount: '2', shortCount: '1', duration: '10' })[id],
      files: [], textContent: '', handlers: {},
      addEventListener(name, handler) { this.handlers[name] = handler; },
      querySelector() { return element('submit'); }
    });
    return elements.get(id);
  }
  const calls = [];
  let attempts = 0;
  const context = {
    document: { getElementById: element }, requireAuth: () => true,
    readStoredJson: () => ({ id: 'material', filename: 'notes.pdf' }),
    MATERIAL_STORAGE_KEY: 'material', EXAM_STORAGE_KEY: 'exam', RESULT_STORAGE_KEY: 'result',
    localStorage: storage(), sessionStorage: storage(),
    window: { location: { href: '' } }, showLoading() {}, hideLoading() {},
    URLSearchParams, encodeURIComponent,
    async apiRequest(path, options) {
      calls.push({ path, options });
      if (path === '/exams/generate') return { id: 'new-exam' };
      if (failAttemptOnce && attempts++ === 0) throw new Error('Temporary failure');
      return { attempt_id: 'new-attempt', questions: badCounts ? [] : [{ type: 'mcq' }, { type: 'mcq' }, { type: 'short' }] };
    }
  };
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../assets/js/create-exam.js'), 'utf8'), context);
  return { context, calls, element, submit: () => element('examForm').handlers.submit({ preventDefault() {} }) };
}

test('passes exact selected counts and navigates to the created attempt', async () => {
  const app = setup();
  await app.submit();
  assert.deepEqual(JSON.parse(app.calls[0].options.body), {
    material_id: 'material', mcq_count: 2, short_count: 1, duration_minutes: 10
  });
  assert.equal(app.context.window.location.href, 'exam.html?attempt=new-attempt');
});

test('rejects a mismatched attempt without redirecting', async () => {
  const app = setup({ badCounts: true });
  await app.submit();
  assert.equal(app.context.window.location.href, '');
  assert.match(app.element('examMessage').textContent, /question counts/);
});

test('retries attempt creation without regenerating the exam', async () => {
  const app = setup({ failAttemptOnce: true });
  await app.submit();
  await app.submit();
  assert.equal(app.calls.filter(call => call.path === '/exams/generate').length, 1);
  assert.equal(app.context.window.location.href, 'exam.html?attempt=new-attempt');
});
