import { RendererOptions, createRenderer, Slot, watchEffect, h, Fragment, reactive, FunctionalComponent } from "vue";

export const RenderSlot: FunctionalComponent<{ slot: Slot }> = ({slot}) => typeof slot === 'function' ? slot() : slot;

// HACK: this is very imperfectly typed because our peculiar usage doesn't match the general api shape
const options: RendererOptions = {
  patchProp(el, key, prev, value) {
    el[key] = value;
  },

  insert(el, parent, anchor) {
    if (!el) return; // e.g. Text node, comments
    el._parent = parent;
    if (anchor) {
      parent.splice(anchor._i, 0, el);
      el._i = anchor._i;
      for (let i = el._i + 1, l = parent.length; i < l; i++)
        parent[i]._i = i;
    }
    else
      el._i = parent.push(el) - 1;
  },

  remove(el) {
    if (el) {
      const parent = el._parent;
      parent.splice(el._i, 1);
      for (let i = el._i, l = parent.length; i < l; i++)
        parent[i]._i = i;
    }
  },

  createElement($type) { 
    return { $type };
  },

  createText() {},
  createComment() {},
  setText() {},
  setElementText() {},

  parentNode(n) {
    return n._parent;
  },

  nextSibling(n) {
    return n._parent[n._i + 1];
  },

  querySelector() {},
  setScopeId() {},
  cloneNode() {},
  insertStaticContent() {},
}

const { render } = createRenderer(options);

export function toObjects<T extends object>(slot: Slot) {
  const result = reactive<T[]>([]);
  watchEffect(() => {
    render(h(Fragment, slot()), result);
  });
  return result;
}