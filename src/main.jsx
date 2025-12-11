import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/services/store";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
// import '@mantine/core/styles.css';




ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SpeedInsights />

    <Provider store={store}>
      <ChakraProvider value={defaultSystem} >
        <App />
      </ChakraProvider>

    </Provider>


  </React.StrictMode>
);
