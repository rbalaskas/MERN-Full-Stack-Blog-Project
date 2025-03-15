import React from 'react';
import '../css/AboutUs.css';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <section className="about-us">
            <div className="about-us__container">
                <div className="about-us__content">
                    <div className="about-us__header">
                        <h2 className="about-us__title">About Us</h2>
                        <div className="about-us__title-underline"></div>
                    </div>
                    
                    <div className="about-us__text-container">
                        <p className="about-us__text">
                            Welcome to <span className="about-us__highlight">O Koutsompolis</span>, a place where stories come alive and connect us all.
                            Our journey began with a simple idea: to create a space where anyone can share their voice,
                            their ideas, and their creativity with the world.
                        </p>
                        <p className="about-us__text">
                            In a world where information is abundant but authentic connections are rare, we wanted to
                            create a platform that fosters meaningful conversations and shared experiences. Whether
                            you're a seasoned writer, an aspiring blogger, or someone who simply enjoys reading and
                            engaging with fresh content, <span className="about-us__highlight">O Koutsompolis</span> is here for you.
                        </p>
                        <p className="about-us__text">
                            We believe that everyone has a story worth telling, and we want to make it easier for
                            those stories to be heard. By providing a user-friendly platform with robust tools for
                            content creation and engagement, we empower our users to share their stories in their
                            own words, on their own terms.
                        </p>
                        <p className="about-us__text">
                            Our mission is simple: to inspire creativity, connect people through stories, and build
                            a community where every voice matters. Thank you for being a part of our journey, and
                            we can't wait to see what you'll create.
                        </p>
                    </div>
                    
                    <div className="about-us__cta">
                        <Link to="/register" className="about-us__cta-link">
                            <button className="about-us__cta-button">Get Started</button>
                        </Link>
                    </div>
                </div>
                
                <div className="about-us__decoration">
                    <div className="about-us__shape about-us__shape--1"></div>
                    <div className="about-us__shape about-us__shape--2"></div>
                    <div className="about-us__shape about-us__shape--3"></div>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;