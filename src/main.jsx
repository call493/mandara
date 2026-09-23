import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.jsx';
import { SoundProvider } from './hooks/useSoundFX.jsx';

import '../style.css';
import '../mediaqueries.css';
import './editorial.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <SoundProvider>
        <BrowserRouter basename="/mandara">
          <App />
        </BrowserRouter>
      </SoundProvider>
    </HelmetProvider>
  </React.StrictMode>,
);

