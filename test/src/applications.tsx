import { View } from 'bare';

import Calendar from './components/calendar';
import Clock from './components/clock';
import Calculator from './components/calculator';
import Notes from './components/notes';
import Music from './components/music';
import Browser from './components/browser';
import Files from './components/files';
import Contacts from './components/contacts';
import Terminal from './components/terminal';
import Preferences from './components/preferences';
import Markdown from './components/markdown';
import Eyes from './components/eyes';
import Media from './components/media';

import Styleguide from './App';
import Email from './Email';
import GridPage from './Grid';
import Live from './Live';

const Applications = {
  'calendar': {
    icon: 'calendar', title: 'Calendar', client: <Calendar />, rect: { width: 360, height: 332 }
  },
  'clock': {
    icon: 'clock', title: 'Clock', client: <Clock />, rect: { width: 300, height: 332 }
  },
  'calculator': {
    icon: 'calculator', title: 'Calculator', client: <Calculator />, rect: { width: 255, height: 332 }
  },
  'notes': {
    icon: 'note-sticky', title: 'Notes', client: <Notes />, rect: { width: 800, height: 600 }
  },
  'music': {
    icon: 'music', title: 'Music', client: <Music />, rect: { width: 400, height: 400 }
  },
  'files': {
    icon: 'files', title: 'Files', client: <Files />, rect: { width: 800, height: 600 }
  },
  'contacts': {
    icon: 'address-book', title: 'Contacts', client: <Contacts />, rect: { width: 800, height: 600 }
  },
  'terminal': {
    icon: 'terminal', title: 'Terminal', client: <Terminal />, rect: { width: 800, height: 600 }
  },
  'markdown': {
    icon: 'marker', title: 'Markdown', client: <Markdown args="/Learning Kopi.md" />, rect: { width: 1024, height: 800 }
  },
  'media': {
    icon: 'image', title: 'Media', client: <Media />, rect: undefined,
  },
  'eyes': {
    icon: 'eye', title: 'Eyes', client: <Eyes />, rect: { width: 255, height: 162 }
  },
  'browser': {
    icon: 'globe', title: 'Browser', client: <Browser />, rect: { width: 1440, height: 1024 }
  },
  'email': {
    icon: 'inbox', title: 'Email', client: <Email />, rect: { width: 1440, height: 1024 }
  },
  'grid': {
    icon: 'question', title: 'Grid', client: <GridPage />, rect: { width: 1024, height: 800 }
  },
  'live': {
    icon: 'question', title: 'Live', client: <Live />, rect: { width: 1024, height: 800 }
  },
  'styleguide': {
    icon: 'palette', title: 'Styleguide', client: <Styleguide />, rect: { width: 1024, height: 800 }
  },
  //
  'griddraw': {
    icon: 'draw-polygon', title: 'Grid Draw', client: <View as="iframe" frameBorder="0" src="https://mike-austin.com/draw-2" />, rect: { width: 1280, height: 900 }
  },
  'bestestmoviesever': {
    icon: 'film', title: 'Bestest Movies Ever', client: <View as="iframe" frameBorder="0" src="https://bestestmoviesever.com" />, rect: { width: 1280, height: 900 }
  },
  'kopinotebook': {
    icon: 'book', title: 'Kopi Notebook', client: <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop-old/clients/kopi-ide" />, rect: { width: 1280, height: 900 }
  },
  'uibuilder': {
    icon: 'display', title: 'UI Builder', client: <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop-old/clients/builder" />, rect: { width: 1280, height: 900 }
  },
} as const;

export default Applications;
