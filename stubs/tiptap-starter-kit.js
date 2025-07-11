/* eslint-disable */
export default function StarterKit(options = {}) {
  return { name: "starterKit", options };
}
StarterKit.configure = function (opts = {}) {
  return StarterKit(opts);
};
