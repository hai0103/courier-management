import React from "react";

const ContentWrapper = ({children}) => {
    return (
        <div className="content-body">{children}</div>
    );
};

ContentWrapper.Header = function ContentWrapperHeader({children}) {
    return (
        <div className="content-header row">
            {
                React.Children.map(children, child => {
                    return child
                })
            }
        </div>
    );
}

ContentWrapper.LeftHeader = function ContentWrapperLeftHeader({children}) {
    return (
        <div className="content-header-left col-md-6 col-12">
            {children}
        </div>
    );
}

ContentWrapper.RightHeader = function ContentWrapperRightHeader({children}) {
    return (
        <div className="content-header-right col-md-6 col-12">
            {children}
        </div>
    );
}

export default ContentWrapper;
