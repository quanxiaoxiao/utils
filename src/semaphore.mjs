export default class Semaphore {
  constructor(capacity) {
    this.capacity = capacity;
    this.counter = 0;
    this.queue = [];
  }

  take() {
    if (this.queue.length > 0) {
      const fn = this.queue.shift();
      this.counter++;
      fn();
    }
  }

  acquire(fn) {
    if (this.available()) {
      this.counter++;
      fn();
    } else {
      this.queue.push(fn);
    }
  }

  release() {
    this.counter--;
    process.nextTick(() => {
      this.take();
    });
  }

  available() {
    return this.capacity > this.counter;
  }
}
