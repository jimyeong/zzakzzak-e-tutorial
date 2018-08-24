import React from 'react';
import './Header.scss';

const Header = ({ right }) => {
  return (
    <header className="Header">
      <a to="#" className="title">
        짹짹이
      </a>
      <div className="right">{right}</div>
    </header>
  );
};

export default Header;
