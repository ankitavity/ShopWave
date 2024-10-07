import React from 'react';
import { Link } from 'react-router-dom';
import "./AboutPage.css";
import Avatar from "./../../images/Avatar.jpg"
import InstagramIcon from "@material-ui/icons/Instagram"
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Resume_1 from "./../../images/Resume_1.pdf"


const AboutPage = () => {


    return (
        <>
        <section className="home" id="home">
            <div className="home-content">
                <h3>Hello, It's Me </h3>
                <h1>Subham Chandra</h1>
                <h3>And, I'm a <span className="multiple-text">Frontend Developer</span> </h3>
                <p>I love to Code. Started coding with Java from D.B.M.S. English School. Since then i have been coding on
                    various
                    other programming languages like Javascript, C, Python and C++. Currently Pursuing BTECH in Computer
                    Science and Engineering from Techno Main Salt Lake.</p>

                <div className="social-media">
                    <Link to="https://www.facebook.com/subham.chandra.750/"><FacebookIcon className="fa-brands fa-facebook" /></Link>
                    <Link to="https://twitter.com/SubhamC60715111"><TwitterIcon className="fa-brands fa-twitter" /></Link>
                    <Link to="https://www.instagram.com/subhamchandra222/"><InstagramIcon className="fa-brands fa-instagram" /></Link>
                    <Link to="https://www.linkedin.com/in/subhamchandra528/"><LinkedInIcon className="fa-brands fa-linkedin" /></Link>
                </div>
                <a href={Resume_1} className="btn" download>Download CV</a>
            </div>

            <div className="home-img">
                <img src={Avatar} alt="" />
            </div>

        </section>
        </>

    )
}

export default AboutPage;
