import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
    return (
        <section className="about-section">
            <h2>About Us</h2>
            <p>
                We are a dedicated team committed to delivering the best services to our clients. Our mission is to provide innovative solutions that meet the needs of our customers and exceed their expectations.
            </p>
            <img src="/images/about-us.jpg" alt="About Us" className="about-image" />
            <p>
                With years of experience in the industry, we pride ourselves on our professionalism and attention to detail. Our team is passionate about what we do, and we strive to create a positive impact in every project we undertake.
            </p>
        </section>
    );
};

export default AboutSection;