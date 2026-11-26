/** Contract of the JSONPlaceholder `/posts` resource, used by the API example. */
export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type NewPost = Omit<Post, 'id'>;

/** Runtime check of the contract: returns the list of problems (empty when the shape is right). */
export function postProblems(value: unknown): string[] {
  const problems: string[] = [];
  if (typeof value !== 'object' || value === null) return ['not an object'];
  const post = value as Record<string, unknown>;
  for (const key of ['userId', 'id'] as const) {
    if (typeof post[key] !== 'number') problems.push(`${key} must be a number`);
  }
  for (const key of ['title', 'body'] as const) {
    if (typeof post[key] !== 'string' || post[key] === '') problems.push(`${key} must be a non-empty string`);
  }
  return problems;
}
