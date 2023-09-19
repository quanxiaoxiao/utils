import { EventEmitter } from 'node:events';

class Semaphore extends EventEmitter {
  #counter = 0;

  #queue = [];

  #capacity = 1;

  constructor(capacity) {
    super();
    if (typeof capacity === 'number' && capacity > 0) {
      this.#capacity = capacity;
    }
  }

  #take() {
    if (!this.isEmpty()) {
      const fn = this.#queue.shift();
      this.#counter++;
      fn();
    }
  }

  #available() {
    return this.#capacity > this.#counter;
  }

  acquire(fn) {
    if (this.#available()) {
      this.#counter++;
      fn();
    } else {
      this.#queue.push(fn);
    }
  }

  release() {
    if (this.#counter > 0) {
      this.#counter--;
      process.nextTick(() => {
        if (!this.isEmpty()) {
          this.#take();
        } else {
          this.emit('empty');
        }
      });
    }
  }

  isEmpty() {
    return this.#queue.length === 0;
  }
}

export default Semaphore;
