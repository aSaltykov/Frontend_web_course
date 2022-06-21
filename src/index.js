import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './components/Login';
import { CookiesProvider } from 'react-cookie'
import Register from './components/Register';
import Main from './components/Main';


function Router() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/main' element={<Main/>}/>
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);


reportWebVitals();
