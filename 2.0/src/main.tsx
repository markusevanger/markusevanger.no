import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CV from './CV.tsx';


import no_main from './translations/no/no_main.json'
import en_main from './translations/en/en_main.json'

import no_cv from './translations/no/no_cv.json'
import en_cv from './translations/en/en_cv.json'

import i18next from "i18next";
import { I18nextProvider } from "react-i18next";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "/cv",
    element: <CV></CV>
  }
]);

i18next.init({
  interpolation: { escapeValue: true },
  lng: "no",
  resources: {
    en: { main: en_main, cv: en_cv },
    no: { main: no_main, cv: no_cv }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </StrictMode>,
)
