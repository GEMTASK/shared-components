import { KopiValue } from '../types';

import KopiNumber from './KopiNumber';

class KopiArray extends KopiValue {
  // static readonly emptyValue = () => new KopiArray([]);

  static async from(iterable: AsyncIterable<KopiValue>) {
    let elements: KopiValue[] = [];

    for await (const element of iterable) {
      elements = [...elements, await element];
    }

    return new KopiArray(elements);
  }

  elements: (KopiValue | Promise<KopiValue>)[];

  constructor(elements: (KopiValue | Promise<KopiValue>)[]) {
    super();

    this.elements = elements;

    Promise.all(elements).then(resolvedElements => {
      this.elements = resolvedElements;
    });
  }

  override async inspect() {
    const elements = await Promise.all(
      this.elements.map(async element => (await element).inspect())
    );

    return `[${elements.join(', ')}]`;
  }

  size() {
    return new KopiNumber(this.elements.length);
  }
}

export default KopiArray;
