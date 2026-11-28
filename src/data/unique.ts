let counter = 0;

/**
 * Returns an id that never repeats across parallel workers or runs:
 * `<prefix>-<time>-<worker>-<counter>`. Use it for every record a test creates (users, orders, names),
 * so two tests running at the same time never share data.
 */
export function uniqueId(
  prefix = 'qa',
  worker: string = process.env.TEST_PARALLEL_INDEX ?? process.env.TEST_WORKER_INDEX ?? '0',
): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${worker}-${counter}`;
}
