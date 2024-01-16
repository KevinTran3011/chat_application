import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/index.js";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<div>Loading...</div>}>
            <App />
          </Suspense>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
