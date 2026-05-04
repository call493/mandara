import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';

import '../style.css';
import '../mediaqueries.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/mandara">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

