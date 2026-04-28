type StoreWithSelector<T> = {
  subscribe<S>(
    selector: (state: T) => S,
    listener: (value: S, prev: S) => void,
  ): () => void;
};

export function storeEffect<T, S>(
  store: StoreWithSelector<T>,
  selector: (state: T) => S,
  effect: (value: S) => (() => void) | void,
): () => void {
  let cleanup: (() => void) | void;

  const unsub = store.subscribe(selector, (value) => {
    if (typeof cleanup === 'function') cleanup();
    cleanup = effect(value);
  });

  return () => {
    unsub();
    if (typeof cleanup === 'function') cleanup();
  };
}
