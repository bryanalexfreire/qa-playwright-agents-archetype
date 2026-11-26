import { test, expect } from '../fixtures';
import { postProblems, type NewPost, type Post } from '../models';

/**
 * API example: contract, behaviour and negative tests of a REST resource.
 * Requirement IDs: POST-01 read · POST-02 create · POST-03 update · POST-04 delete · POST-05 errors.
 */
const draft: NewPost = { userId: 1, title: 'Regression suite review', body: 'Checked on every pull request.' };

test.describe('Posts API', { tag: '@api' }, () => {
  test('POST-01 · A post can be read and matches the contract', async ({ posts }) => {
    const response = await posts.get(1);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const post = (await response.json()) as Post;
    expect(postProblems(post)).toEqual([]);
    expect(post.id).toBe(1);
  });

  test('POST-01 · The list can be filtered by author', async ({ posts }) => {
    const response = await posts.list({ userId: 1 });
    expect(response.ok()).toBeTruthy();
    const list = (await response.json()) as Post[];
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((post) => post.userId === 1)).toBe(true);
    for (const post of list) expect(postProblems(post)).toEqual([]);
  });

  test('POST-02 · A post is created and echoed with a new id', async ({ posts }) => {
    const response = await posts.create(draft);
    expect(response.status()).toBe(201);
    const created = (await response.json()) as Post;
    expect(created).toMatchObject(draft);
    expect(created.id).toBeGreaterThan(0);
  });

  test('POST-03 · A post is replaced and the response shows the new data', async ({ posts }) => {
    const replacement: Post = { id: 1, ...draft, title: 'Updated title' };
    const response = await posts.replace(1, replacement);
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(replacement);
  });

  test('POST-04 · A post is deleted', async ({ posts }) => {
    const response = await posts.remove(1);
    expect(response.status()).toBe(200);
  });

  test('POST-05 · An unknown post answers 404', async ({ posts }) => {
    const response = await posts.get(999_999);
    expect(response.status()).toBe(404);
  });

  test('POST-05 · A read answers within the response-time budget', async ({ posts }) => {
    const started = Date.now();
    const response = await posts.get(1);
    expect(response.ok()).toBeTruthy();
    expect(Date.now() - started).toBeLessThan(2_000);
  });
});
