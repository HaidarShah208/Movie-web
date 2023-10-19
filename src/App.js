import { Routes, Route } from "react-router-dom";
import "./App.css";
import Card from "./components/webFiles/Card";
import Header from "./components/webFiles/Header";
import Addmovie from "./components/webFiles/Addmovie";
import Details from "./components/webFiles/Details";
import PageNotFound from "./components/webFiles/PageNotFound";
import { createContext, useEffect, useState } from "react";
import Login from "./components/webFiles/Login";
import SignUp from "./components/webFiles/SignUp";

const Appstate = createContext();
function App() {
  const [login, setLogin] = useState(false);
  const [userName, setUserName] = useState("");
  return (
    <Appstate.Provider value={{ login, userName, setLogin, setUserName }}>
      <div className="App relative">
        <Header />
        <Routes>
          <Route path="/" element={<Card />} />
          <Route path="/addmovie" element={<Addmovie />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Appstate.Provider>
  );
}

// i used websites material-ui icons ,, tailblock website ,, bcrypt for encription password
export default App;
export {Appstate}
