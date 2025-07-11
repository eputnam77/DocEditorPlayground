/* eslint-disable */
export default class Quill {
  constructor(el, options) {
    this.root = { innerHTML: "" };
    this.options = options;
    this.handlers = {};
  }
  on(event, cb) {
    this.handlers[event] = cb;
  }
}
