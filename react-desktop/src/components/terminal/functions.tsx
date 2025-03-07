/* eslint-disable import/no-anonymous-default-export */

import * as WebDAV from 'webdav';

import { KopiString, KopiDate } from 'kopi-language';
import { KopiValue, KopiClass } from 'kopi-language';

import Clock from '../clock/Clock';
import Calendar from '../calendar/Calendar';

const webdavClient = WebDAV.createClient("https://webdav.mike-austin.com", {});

class KopiDateFunction extends KopiClass {
  static now() {
    return new KopiDate(new Date());
  }

  static async inspect() {
    return new Date().toLocaleString();
  }

  static async apply(thisArg: void, [value]: [value: KopiValue]) {
    return value;
  }
}

class KopiClock extends KopiClass {
  static async inspect() {
    return <Clock style={{ width: 150 }} />;
  }
}

class KopiCalendar extends KopiClass {
  static async inspect() {
    return <Calendar style={{ width: 360 }} />;
  }
}

async function kopi_meter(value: number) {
  return new MetricUnit(value);
}

class MetricUnit extends KopiClass {
  value: number;

  constructor(value: number) {
    super();

    this.value = value * 1000;
  }

  // toImperial() {
  //   return new ImperialUnit(this.value.value * 3.28084);
  // }
}

class KopiLs_ {
  args: any[];

  constructor(args: any[]) {
    this.args = args;
  }

  async apply(thisArg: void, [arg]: [any]) {
    return new KopiLs_([...this.args, arg]);
  }

  async inspect() {
    const filename = this.args[this.args.length - 1] instanceof KopiString
      ? '/' + this.args[this.args.length - 1].value
      : '/';

    const directoryItems = await webdavClient.getDirectoryContents(filename);

    if (Array.isArray(directoryItems)) {
      const max = directoryItems.reduce((max, item) => item.basename.length > max
        ? item.basename.length
        : max,
        0);

      if (this.args.find(arg => arg.name === 'l')) { // TODO
        const items = directoryItems.map(({ basename, type, size, lastmod }) =>
          (basename + (type === 'directory' ? '/' : '')).padEnd(max + 4) +
          (size.toString() + ' B').padEnd(8) +
          new Date(lastmod).toLocaleDateString());

        return items.join('\n');
      }

      const items = directoryItems.map(({ basename, type, size, lastmod }) =>
        (basename + (type === 'directory' ? '/' : '')).padEnd(max + 4));

      return items.join('');
    }

    return '';
  }
}

class KopiLs {
  static async apply(thisArg: void, [arg]: [KopiValue]) {
    return new KopiLs_([arg]);
  }

  static async inspect() {
    return new KopiLs_([]).inspect();
  }
}

class KopiLog extends KopiString {
  async inspect() {
    return this.value;
  }
}

async function kopi_cat(filename: KopiString) {
  const str = await webdavClient.getFileContents('/' + filename.value, { format: 'text' });

  if (typeof str === 'string') {
    return new KopiLog(str);
  }

  return '';
}

async function kopi_input(message: KopiString) {
  return new KopiString(prompt(message.value) ?? '');
}

async function kopi_export(value: KopiValue) {
  return value;
}

export {
  KopiDateFunction,
  KopiClock,
  KopiCalendar,
  KopiLs,
  //
  kopi_meter,
  kopi_cat,
  //
  kopi_input,
  kopi_export,
};
