import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import '../index.css';
import NewsLetter from '../pages/NewsLetter';

const Layout = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <NewsLetter isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Layout;
