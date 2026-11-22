import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { RootStore, RootStoreProvider } from "./store/globals/root"
import "./styles/index.scss"

const rootStore = new RootStore()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootStoreProvider store={rootStore}>
      <App />
    </RootStoreProvider>
  </React.StrictMode>,
)
