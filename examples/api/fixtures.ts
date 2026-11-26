import { test as base, expect, type APIRequestContext } from '@playwright/test';
import type { NewPost, Post } from './models';

/** Public practice API. Override with API_BASE_URL to point the suite at a mock or another environment. */
export const API_BASE_URL = process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';

/** Thin typed client: one method per operation, no assertions (those stay in the tests). */
export class PostsClient {
  constructor(private readonly request: APIRequestContext) {}

  list(query: Record<string, string | number> = {}) {
    return this.request.get('/posts', { params: query });
  }

  get(id: number | string) {
    return this.request.get(`/posts/${id}`);
  }

  create(post: NewPost) {
    return this.request.post('/posts', { data: post });
  }

  replace(id: number, post: Post) {
    return this.request.put(`/posts/${id}`, { data: post });
  }

  remove(id: number) {
    return this.request.delete(`/posts/${id}`);
  }
}

export const test = base.extend<{ posts: PostsClient }>({
  baseURL: async ({}, use) => use(API_BASE_URL),
  posts: async ({ request }, use) => use(new PostsClient(request)),
});

export { expect };
