/**
 * TASK:
 * Build a function that queues async tasks and retries them up to 3 times if they fail.
 * 
 * Requirements:
 * - A queue that accepts asynchronous tasks (functions that return promises).
 * - Each task should retry up to 3 times on failure (configurable).
 * - Use exponential backoff between retries (e.g., 100ms, 200ms, 300ms...).
 * - Provide a way to execute all queued tasks and gather results.
 */
  