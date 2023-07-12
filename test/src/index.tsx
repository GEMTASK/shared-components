import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import App from './App';
import Grid from './Grid';
import Email from './Email';
import Live from './Live';

import reportWebVitals from './reportWebVitals';

const Desktop = React.lazy(() => import('./Desktop'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/grid",
    element: <Grid />,
  },
  {
    path: "/email",
    element: <Email />,
  },
  {
    path: "/live",
    element: <Live />,
  },
  {
    path: "/desktop",
    element: (
      <Suspense>
        <Desktop />
      </Suspense>
    ),
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
