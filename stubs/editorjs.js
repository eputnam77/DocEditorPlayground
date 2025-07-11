/* eslint-disable */
export default class EditorJS {
  constructor(options = {}) {
    this.options = options;
    this.data = options.data || {};
    if (options.onChange) options.onChange();
  }
  async save() {
    return this.data;
  }
  render() {}
  destroy() {}
}
