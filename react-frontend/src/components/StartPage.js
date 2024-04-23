import React from "react";
import "./StartPage.css";
import { useNavigate } from "react-router-dom";

function StartPage() {
  const navigate = useNavigate();

  const redirectToFeedback = () => {
    navigate("/feedback");
  };

  const redirectToFAQ = () => {
    navigate("/faq");
  };

  return (
    <>
      <div className="start-page-container">
        <div className="left-section">
          <div className="logo-container">
            <img src="/logo.png" alt="logo" />
          </div>
          <ul className="navigation text-small-caps">
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
          <div className="main-content">
            <h1>Welcome</h1>
            <p>
              Get ready to unlock the full potential of your wardrobe with
              Wardrobe Wizard! Your stylish companion for effortless wardrobe
              management!
            </p>

            <p className="reclaim">Reclaim your closet!</p>
            <button className="cta-btn" onClick={() => navigate("/register")}>
              Sign Up
            </button>
          </div>
        </div>

        <div className="right-section">
          <div className="right-side-logo">
            <img src="/WWLogo.png" alt="logo" />
          </div>
          <div className="start-page-images">
            <div className="start-page-image-1">
              <img src="/StartP1.png" alt="image" />
            </div>
            <div className="start-page-image-2">
              <img src="/StartP2.png" alt="image" />
            </div>
            <div className="start-page-image-3">
              <img src="/StartP3.png" alt="image" />
            </div>
          </div>
        </div>

        <div className="start-page-footer">
          <div className="social-media-icons">
            <img src="/facebook.png" alt="facebook icon" />
            <img src="/instagram.png" alt="instagram icon" />
            <img src="/linkedin.png" alt="linkedin icon" />
          </div>

          <button className="giveFeedback" onClick={redirectToFeedback}>
            Provide Feedback
          </button>

          <button className="needFAQ" onClick={redirectToFAQ}>
            Frequently Asked Questions
          </button>
        </div>
      </div>
    </>
  );
}

export default StartPage;
