import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../src/chat-application.scss/main.css";
import LogIn from "./components/logIn/logIn.component";
import SignUp from "./components/signUp/signUp.component";
import ChatWindow from "./components/chatWindow/chatWindow.component";
import Settings from "./components/settings/settings.component";

function App() {
  return (
    <>
      <div className="app_container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LogIn></LogIn>}></Route>
            <Route path="/signUp" element={<SignUp></SignUp>}></Route>
            <Route
              path="/chats/:chatId"
              element={<ChatWindow></ChatWindow>}
            ></Route>
            <Route
              path="/chat/:chatId/settings"
              element={<Settings></Settings>}
            ></Route>
          </Routes>
        </BrowserRouter>{" "}
      </div>
    </>
  );
}

export default App;
