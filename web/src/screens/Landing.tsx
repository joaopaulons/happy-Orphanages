import React from 'react';
import '../styles/global.css';
import '../styles/pages/landing.css'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom';

import logoImg from '../images/logo.svg';

function Landing() {
    return (
        <div id="page-landing">
            <div className="content-wrapper">
                <img src={logoImg} alt=""/>

                <main>
                    <h1>Leve felicidade para o mundo</h1>
                    <p>Visite orfanatos e mude o dia de muitas crianças.</p>
                </main>

                <div className="location">
                    <strong>London</strong>
                    <span> England</span>
                </div>
                <Link to="/app" className="enter-app">
                    <FiArrowRight size={26} color="rgba(8, 8 , 8, 8.6)" />
                </Link>
            </div>
        </div>
    );
}

export default Landing;
