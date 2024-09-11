import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li><Link to="/posts/categories/Nicosia">Nicosia</Link></li>
        <li><Link to="/posts/categories/Limassol">Limassol</Link></li>
        <li><Link to="/posts/categories/Paphos">Paphos</Link></li>
        <li><Link to="/posts/categories/Larnaca">Larnaca</Link></li>
        <li><Link to="/posts/categories/Ammochostos">Ammochostos</Link></li>
        <li><Link to="/posts/categories/Cyprus">Cyprus</Link></li>
      </ul>
      <div className="footer__advertise">
        <Link to="/advertisment">Advertisement</Link>
        <Link to="/FAQ">FAQ</Link>
        <Link to="/support">Support</Link>
      </div><br/>
      <div className="footer__copyright">
        <small>All Rights Reserved &copy; 2024 <a href="https://rbcoding.com" target="_blank" rel="noopener noreferrer">RB Coding</a>.</small>
      </div>
    </footer>
  );
}

export default Footer;
