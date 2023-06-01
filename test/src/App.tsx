import React from 'react';

import logo from './logo.svg';
import './App.css';
import { Button } from 'cra';
// import { MyButton } from 'vite';
import { Button as BareButton } from 'bare';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Button />
        {/* <MyButton /> */}
        <BareButton />
      </header>
    </div>
  );
}

export default App;
