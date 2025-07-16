import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">Hızlı Satış</h1>
      <nav className="nav">
        <Link to="/home">Anasayfa</Link>
        <Link to="/sales">Satışlar</Link>
        <Link to="/reports">Raporlar</Link>
      </nav>
    </header>
  );
};

export default Header;
