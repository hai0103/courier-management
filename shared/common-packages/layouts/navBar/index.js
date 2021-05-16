import React from 'react';
import NavBarHeader from "./navBarHeader";
import NavBarLeft from "./navBarLeft";
import NavBarRight from "./navbarRight";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <nav
                className="header-navbar navbar-expand-md navbar navbar-with-menu fixed-top navbar-shadow navbar-border ">
                <div className="navbar-wrapper">
                    <NavBarHeader/>
                    <div className="navbar-container content">
                        <div className="collapse navbar-collapse" id="navbar-mobile">
                            <NavBarLeft/>
                            <NavBarRight/>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

export default NavBar;
