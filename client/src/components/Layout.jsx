import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import '../index.css';

const Layout = () => {
  return (
    <div id="root"> {/* Main container for the whole page */}
      <Header />
      <main> {/* Content that takes up remaining space */}
        <Outlet />
      </main>
      <Footer /> {/* Footer will now stay at the bottom */}
    </div>
  );
};

export default Layout;
