import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/okoutsompolis_logo.png';
import { FaBars } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import '../css/Header.css';
import '../index.css';
import { UserContext } from '../context/userContext';

const Header = () => {
    const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);

    const { currentUser } = useContext(UserContext);

    const closeNavHandler = () => {
        if (window.innerWidth < 800) {
            setIsNavShowing(false);
        } else {
            setIsNavShowing(true);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 800) {
                setIsNavShowing(true);
            } else {
                setIsNavShowing(false);
            }
        };

        window.addEventListener('resize', handleResize);

        // Clean up event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav>
            <div className="container nav__container">
                <Link to="/" className="nav__logo">
                    <img src={logo} alt="Logo" />
                </Link>
                {isNavShowing && (
                    <ul className="nav__menu">
                        {currentUser?.userId ? (
                            <>
                                <li>
                                    <Link to={`/profile/${currentUser.userId}`} onClick={closeNavHandler}>
                                        {currentUser?.name}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/create" onClick={closeNavHandler}>
                                        Create Post
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/authors" onClick={closeNavHandler}>
                                        Authors
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/logout" onClick={closeNavHandler}>
                                        Logout
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link to="/login" onClick={closeNavHandler}>
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                )}
                <button className="nav__toggle-btn" onClick={() => setIsNavShowing(!isNavShowing)}>
                    {isNavShowing ? <AiOutlineClose /> : <FaBars />}
                </button>
            </div>
        </nav>
    );
};

export default Header;
