import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";


function Tab(props) {
    const {t} = useTranslation('common');
    const [tab, setTab] = useState(0);
    useEffect(() => {

    });



    return (
        <div className="card card-no-border">
            {props.title && <div className="card-header">
                <h4 className="card-title">{props.title}</h4>
            </div>}
            {/*<div className="card-content">*/}
            {/*    <div className="card-body">*/}
                    {props.description && <p></p>}
                    <ul className="nav nav-pills nav-pills-sm nav-pills-sm-light" role="tablist">
                        {props.content && props.content.length > 0 && props.content.map((item, index) => {
                            return (
                                <li key={index} className="nav-item" onClick={() => {
                                  if (item.disable) {
                                    return
                                  }
                                  setTab(index)
                                }}>
                                    <a className={`nav-link ${item.dropdown ? "dropdown-toggle" : ""} ${(item.active || tab == index ) ? "active" : ""} ${item.disable ? "disabled" : ""}`} id={item.menu} data-toggle={item.dropdown ? "dropdown" : "tab"} href={`#${item.menu}`}
                                       aria-controls={item.menu} role="tab" aria-selected="true">{item.name}</a>
                                    {item.dropdown && <div className="dropdown-menu">
                                        {item.option && item.option.length > 0 && item.option.map((_item, _index) => {
                                            return (
                                                <a className="dropdown-item" key={_index} id="dropdownOpt1-tab1" href={`#${_item.menu}`}
                                                   data-toggle="tab" aria-controls={_item.menu} role="tab" aria-selected="true">{_item.name}
                                                </a>
                                            )
                                        })}
                                    </div>}
                                </li>
                            )
                        })}
                    </ul>
                    <div className="tab-content">
                        {props.content && props.content.length > 0 && props.content.map((item, index) => {
                            return (
                                <div key={index} className={`tab-pane in ${(item.active || tab == index) ? "active" : ""}`} id={item.menu} aria-labelledby={item.menu} role="tabpanel">
                                    {item.child}
                                </div>
                            )
                        })}
                        {/*<div className="tab-pane active in" id="active1" aria-labelledby="active-tab1" role="tabpanel">*/}
                        {/*    <p>Macaroon candy canes tootsie roll wafer lemon drops liquorice jelly-o tootsie roll cake.*/}
                        {/*        Marzipan liquorice soufflé cotton candy jelly cake jelly-o sugar plum marshmallow.*/}
                        {/*        Dessert cotton candy macaroon chocolate sugar plum cake donut.</p>*/}
                        {/*</div>*/}
                        {/*<div className="tab-pane" id="link1" aria-labelledby="link-tab1" role="tabpanel">*/}
                        {/*    <p>Chocolate bar gummies sesame snaps. Liquorice cake sesame snaps cotton candy cake sweet*/}
                        {/*        brownie. Cotton candy candy canes brownie. Biscuit pudding sesame snaps pudding pudding*/}
                        {/*        sesame snaps biscuit tiramisu.</p>*/}
                        {/*</div>*/}
                        {/*<div className="tab-pane" id="dropdownOpt11" aria-labelledby="dropdownOpt1-tab1"*/}
                        {/*     role="tabpanel">*/}
                        {/*    <p>Fruitcake marshmallow donut wafer pastry chocolate topping cake. Powder powder gummi*/}
                        {/*        bears jelly beans. Gingerbread cake chocolate lollipop. Jelly oat cake pastry*/}
                        {/*        marshmallow sesame snaps.</p>*/}
                        {/*</div>*/}
                        {/*<div className="tab-pane" id="dropdownOpt12" aria-labelledby="dropdownOpt2-tab1"*/}
                        {/*     role="tabpanel">*/}
                        {/*    <p>Soufflé cake gingerbread apple pie sweet roll pudding. Sweet roll dragée topping cotton*/}
                        {/*        candy cake jelly beans. Pie lemon drops sweet pastry candy canes chocolate cake bear*/}
                        {/*        claw cotton candy wafer.</p>*/}
                        {/*</div>*/}
                        {/*<div className="tab-pane" id="linkOpt1" aria-labelledby="linkOpt-tab1" role="tabpanel">*/}
                        {/*    <p>Cookie icing tootsie roll cupcake jelly-o sesame snaps. Gummies cookie dragée cake jelly*/}
                        {/*        marzipan donut pie macaroon. Gingerbread powder chocolate cake icing. Cheesecake gummi*/}
                        {/*        bears ice cream marzipan.</p>*/}
                        {/*</div>*/}
                    </div>
                {/*</div>*/}
            {/*</div>*/}
        </div>
    );
}

Tab.propTypes = {

};

Tab.defaultProps = {

};

export default Tab;
