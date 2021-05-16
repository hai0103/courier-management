import React from 'react';
import PropTypes from 'prop-types';

function FloatingDialog(props) {
    return (
        <div className="content-right">
            <div className="app-content-overlay show"/>
            <div
                className="slide-content slide-menu slide-menu-xl ps show shadow">
                <div className="card shadow-none">
                    <div
                        className="card-header card-header-main border-bottom d-flex justify-content-between align-items-center bg-light-primary">
                        <div className="task-header d-flex justify-content-start align-items-center">
                            <h3 className="content-header-title mb-0"> {props.title}</h3>
                            <div className="heading-elements">
                                <ul className="list-inline">
                                    <li>
                                        <button onClick={() => {
                                            if (props.onClose) {
                                                props.onClose();
                                            }
                                        }} type="button" className="btn btn-outline-secondary mr-50 px-2">Hủy
                                        </button>
                                    </li>
                                    <li>
                                        <button className="btn btn-primary btn-min-width" onClick={() => {
                                            if (props.onSave) {
                                                props.onSave();
                                            }
                                        }}>Lưu
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card-body card-scroll pt-0">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

FloatingDialog.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
};

FloatingDialog.defaultProps = {};

export default FloatingDialog;
