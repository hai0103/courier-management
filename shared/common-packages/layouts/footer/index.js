import React from 'react';

class Footer extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <footer className="footer footer-static footer-dark navbar-shadow">
                <p className="clearfix blue-grey lighten-2 text-sm-center mb-0 px-2 container center-layout"><span
                    className="float-md-left d-block d-md-inline-block">Copyright &copy; 2020 <a
                    className="text-bold-800 grey darken-2"
                    href="https://alpaca.vn"
                    target="_blank">ALPACA </a></span><span
                    className="float-md-right d-none d-lg-block">Hand-crafted & Made with <i
                    className="feather icon-heart pink"></i></span></p>
            </footer>
        )
    }

}

export default Footer
