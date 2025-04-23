const TaskQueue = require('./taskQueue');

describe('TaskQueue', () => {
  test('executes a successful task once', async () => {
    const task = jest.fn().mockResolvedValue('success');
    const queue = new TaskQueue();

    const result = await queue.add(task);
    expect(result).toBe('success');
    expect(task).toHaveBeenCalledTimes(1);
  });

  test('retries a failing task and eventually succeeds', async () => {
    const task = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('finally works');

    const queue = new TaskQueue();
    const result = await queue.add(task);

    expect(result).toBe('finally works');
    expect(task).toHaveBeenCalledTimes(3);
  });

  test('fails after max retries', async () => {
    const task = jest.fn().mockRejectedValue(new Error('always fails'));
    const queue = new TaskQueue(3, 10);

    await expect(queue.add(task)).rejects.toThrow('always fails');
    expect(task).toHaveBeenCalledTimes(3);
  });

  test('runAll returns all results', async () => {
    const queue = new TaskQueue(2, 10);
    
    const success = jest.fn().mockResolvedValue('ok');
    const fail = jest.fn().mockRejectedValue(new Error('nope'));

    queue.add(success);
    queue.add(fail);

    const results = await queue.runAll();
    
    expect(results.length).toBe(2);
    expect(results[0].status).toBe('fulfilled');
    expect(results[1].status).toBe('rejected');
  });
});
