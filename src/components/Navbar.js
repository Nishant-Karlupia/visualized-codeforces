// navbar made using bootstrap and cusomised with custom css

import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (

        <div className='d-flex flex-column'>
            <nav className="navbar navbar-default fixed-top navbar-expand-lg bg-body-tertiary navbar-container" >
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/" style={{ "overflow": "hidden" }}><h1>Visualised Codeforces</h1></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse w-70 order-3 dual-collapse2" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto ">
                            <li className="nav-item mx-3">
                                <Link className="nav-link " aria-current="page" to="/"><i className="fa fa-light fa-house"></i>Home</Link>
                            </li>
                            <li className="nav-item mx-3">
                                <Link className="nav-link" to="/compare"><i className="fa fa-light fa-code-compare"></i>Compare</Link>
                            </li>
                            <li className="nav-item mx-3">
                                <Link className="nav-link" to="/stats"><i className="fa-solid fa-chart-line" />Stats</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar