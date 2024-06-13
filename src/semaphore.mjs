class Semaphore {
  #counter = 0;

  #queue = [];

  #capacity = 1;

  #emptyFn;

  constructor(capacity, fn) {
    if (typeof capacity === 'number' && capacity > 0) {
      this.#capacity = capacity;
    }
    if (typeof fn === 'function') {
      this.#emptyFn = fn;
    }
  }

  #take() {
    if (!this.isEmpty()) {
      const fn = this.#queue.shift();
      this.#counter++;
      if (fn) {
        fn();
      }
    }
  }

  #available() {
    return this.#capacity > this.#counter;
  }

  acquire(fn) {
    if (this.#available()) {
      this.#counter++;
      fn();
      return true;
    }
    this.#queue.push(fn);
    return false;
  }

  release() {
    if (this.#counter > 0) {
      this.#counter--;
      process.nextTick(() => {
        if (!this.isEmpty()) {
          this.#take();
        } else if (this.#emptyFn && this.#counter === 0) {
          this.#emptyFn();
        }
      });
    } else if (this.#emptyFn && this.isEmpty()) {
      this.#emptyFn();
    }
  }

  isEmpty() {
    return this.#queue.length === 0;
  }
}

export default Semaphore;
