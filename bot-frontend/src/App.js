import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ChessB from "./ChessB";
import Connect4 from "./Connect4";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/chess" element={<ChessB />}/>
        <Route path="/connect4" element={<Connect4 />}/>

      </Routes>
    </BrowserRouter>
  );
}