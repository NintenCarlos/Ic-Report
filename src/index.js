import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Admin } from './Archivos/Admin';
import Report from './Archivos/Report';

const router = createBrowserRouter([{
  path: '/',
  element: <App/>
},
{
  path: '/admin',
  element: <Admin/>
},
{
  path: '/reportar',
  element: <Report/>
}])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

reportWebVitals();
