import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import image from './analyze.jpeg';

function LandingPage() {
    return (
        <div className="landing-container">
            <div className="content">
                <h1 className="title">Welcome to Image Analyzer</h1>
                <img src={image} alt="Image Analysis" className="image" />
                <p className="description">
                    Upload your images and analyze their color compositions effortlessly.
                    Get insights with just one click!
                </p>

                <Link to="/AddImage" className="cta-button">
                    Add Image
                </Link>
            </div>
        </div>
    );
}

export default LandingPage;
