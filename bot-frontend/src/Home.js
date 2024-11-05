import React from "react";
import { Link } from "react-router-dom";
import { FaChessPawn, FaCircle, FaDotCircle } from "react-icons/fa";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to GameAI</h1>
      <p>Click an icon to start playing</p>
      <Link to="/chess">
        <FaChessPawn size={"50px"} />
      </Link>
      <Link to="/connect4">
        <FaCircle size={"50px"} />
      </Link>
      <Link to="/ttt">
        <FaDotCircle size={"50px"} style={{marginLeft: "10px" }}/>
      </Link>
    </div>
  );
};

export default Home;
