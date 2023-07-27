import { KopiValue } from '../types';

class KopiArray extends KopiValue {
  // static readonly emptyValue = () => new KopiArray([]);

  elements: Promise<KopiValue>[];

  constructor(elements: Promise<KopiValue>[]) {
    super();

    this.elements = elements;
  }

  override async inspect() {
    const elements = await Promise.all(
      this.elements.map(async element => (await element).inspect())
    );

    return `[${elements.join(', ')}]`;
  }
}

export default KopiArray;
