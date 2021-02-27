import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "@shopify/app-bridge-react";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store";



let config = null;

function setStorage() {
  let query = new URLSearchParams(window.location.search);

  let app_key = process.env.REACT_APP_SHOPIFY_API_KEY;
  let shop = query.get("shop");

  if (app_key && shop) {
    let data = {
      app_key: app_key,
      shop: shop,
    };

    localStorage.setItem("userData", JSON.stringify(data));
    config = {
      apiKey: data.app_key,
      shopOrigin: data.shop,
    };
  }
}

let userData = localStorage.getItem("userData");
userData = JSON.parse(userData);

setStorage();

let hostname = window.location.hostname;

ReactDOM.render(
  hostname === "localhost" ? (
    <>
      <React.StrictMode>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </React.StrictMode>
    </>
  ) : config !== null ? (
    <Provider config={config}>
      <React.StrictMode>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </React.StrictMode>
    </Provider>
  ) : (
    <div>Can not find config</div>
  ),
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
