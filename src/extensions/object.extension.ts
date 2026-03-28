declare global {
  interface ObjectConstructor {
    /**
     * Copia apenas propriedades não nulas/undefined de `source` para `target`.
     * Remove do `target` qualquer campo que esteja nulo/undefined em `source`.
     * Retorna o próprio `target`.
     */
    assignNotNull<T extends object, U extends object>(target: T, source: U, extras?: Partial<T & U>): T & Partial<U>;

    /**
     * Remove todas as propriedades com valor null ou undefined de um objeto.
     * Retorna o próprio objeto (mutável).
     *
     * Exemplo:
     *   Object.removeNulls({ a: 1, b: null, c: undefined }) // { a: 1 }
     */
    removeNulls<T extends object>(obj: T): T;
  }
}

Object.assignNotNull = function <T extends object, U extends object>(
  target: T,
  source: U,
  extras?: Partial<T & U>,
): T & Partial<U> {
  if (source && typeof source === 'object') {
    for (const key of Object.keys(source) as Array<keyof U>) {
      const val = source[key];
      if (val !== null && val !== undefined) {
        (target as any)[key] = val;
      } else {
        delete (target as any)[key]; // 🔥 remove chaves nulas/undefined
      }
    }
  }

  if (extras && typeof extras === 'object') {
    for (const key of Object.keys(extras) as Array<keyof typeof extras>) {
      (target as any)[key] = (extras as any)[key];
    }
  }

  return Object.removeNulls(target) as T & Partial<U>;
};

Object.removeNulls = function <T extends object>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj) as Array<keyof T>) {
    const val = obj[key];
    if (val === null || val === undefined) {
      delete obj[key];
    }
  }

  return obj;
};

export {};
