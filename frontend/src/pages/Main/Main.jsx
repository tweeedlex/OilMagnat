import React from 'react';
import {Link} from "react-router-dom";

const Main = () => {
  return (
    <div>
      Main
      <Link style={{fontSize: 20}} to="/profile">Profile</Link>
    </div>
  );
};

export default Main;
