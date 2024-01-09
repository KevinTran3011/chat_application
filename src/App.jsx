import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import LogIn from "./components/logIn/logIn.component";
import SignUp from "./components/signUp/signUp.component";
import ChatWindow from "./components/chatWindow/chatWindow.component";
import Settings from "./components/settings/settings.component";
import ChatRoom from "./components/chatRoom/chatRoom.component";
import "@fontsource/plus-jakarta-sans";
import "./App.css";

function App() {
  const userData = useSelector((state) => state.auth.user);
  const [logIn, setLogIn] = useState(false);
  return (
    <>
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LogIn></LogIn>}></Route>
            <Route path="/signUp" element={<SignUp></SignUp>}></Route>
            {userData && (
              <Route path="/:userId/chats/" element={<ChatRoom />}></Route>
            )}
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
