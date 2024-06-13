import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import './App.scss';

import PagesApp from './pages/app/app';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<PagesApp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
