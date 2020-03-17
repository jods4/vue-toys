import { unref, markNonReactive, isRef, UnwrapRef } from 'vue';

const handler: ProxyHandler<object> = {
  get(target, key, receiver) {
    if (typeof key === 'string' && key.startsWith('$refs.'))
      return Reflect.get(target, key.substr(6), receiver);
    const value = Reflect.get(target, key, receiver);
    return unref(value);
  },
  set(target, key, value, receiver) {
    const current = Reflect.get(target, key, receiver);
    if (!isRef(current)) 
      return Reflect.set(target, key, value, receiver);
    current.value = value;
    return true;
  }
}

export function hideRefs<T extends object>(target: T) {
  return markNonReactive(new Proxy(target, handler)) as UnwrapRef<T>;
}