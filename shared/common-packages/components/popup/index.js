import React from 'react';

export default function Popup(props) {
    let {size, position, className, title, hideFooter, footer, modalName} = props
    return(
        <div className="modal fade text-left" id={modalName} tabIndex="-1"
             role="dialog"
            // style={{display: 'block'}}
             aria-labelledby="myModalLabel1"
            // aria-modal="true"
             aria-hidden="true"
        >
            <div className={`modal-dialog modal-dialog-scrollable modal-dialog-centered ${size ? "modal-" + size : ""} ${className ? className : ""}`} role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title" id="myModalLabel1">{title}</h3>
                        <button type="button" className="close rounded-pill" data-dismiss="modal" aria-label="Đóng">
                            <i className="fal fa-times"></i>
                        </button>
                    </div>
                    <div className="modal-body">
                        {props.children}
                    </div>
                    {hideFooter ? null :  <div className="modal-footer">
                        {footer}
                    </div>}
                    {/*<div className="modal-footer">*/}
                    {/*    <button type="button" className="btn btn-light-secondary" data-dismiss="modal">*/}
                    {/*        <i className="bx bx-x d-block d-sm-none"></i>*/}
                    {/*        <span className="d-none d-sm-block">Close</span>*/}
                    {/*    </button>*/}
                    {/*    <button type="button" className="btn btn-primary ml-1" data-dismiss="modal">*/}
                    {/*        <i className="bx bx-check d-block d-sm-none"></i>*/}
                    {/*        <span className="d-none d-sm-block">Accept</span>*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )

}

//
// class Popup extends React.Component{
//     constructor(props) {
//         super(props);
//         this.state = {
//             showFooter: true
//         }
//     }
//
//
//     render() {
//         let {size, position, className, title, hideFooter, footer, modalName} = this.props
//         // let show = true
//         console.log("check footer>>>>", footer)
//         // switch (this.props.size) {
//         //     case "sm": return
//         // }
//         return (
//             <div className="modal fade text-left" id={modalName} tabIndex="-1"
//                  role="dialog"
//                  // style={{display: 'block'}}
//                  aria-labelledby="myModalLabel1"
//                  // aria-modal="true"
//                  aria-hidden="true"
//             >
//                 <div className={`modal-dialog modal-dialog-scrollable modal-dialog-centered ${size ? "modal-" + size : ""} ${className ? className : ""}`} role="document">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h3 className="modal-title" id="myModalLabel1">{title}</h3>
//                             <button type="button" className="close rounded-pill" data-dismiss="modal"
//                                     aria-label="Đóng">
//                                 <i className="bx bx-x"></i>
//                             </button>
//                         </div>
//                         <div className="modal-body">
//                             {this.props.children}
//                         </div>
//                         {hideFooter ? null :  <div className="modal-footer">
//                             {footer}
//                         </div>}
//                         {/*<div className="modal-footer">*/}
//                         {/*    <button type="button" className="btn btn-light-secondary" data-dismiss="modal">*/}
//                         {/*        <i className="bx bx-x d-block d-sm-none"></i>*/}
//                         {/*        <span className="d-none d-sm-block">Close</span>*/}
//                         {/*    </button>*/}
//                         {/*    <button type="button" className="btn btn-primary ml-1" data-dismiss="modal">*/}
//                         {/*        <i className="bx bx-check d-block d-sm-none"></i>*/}
//                         {/*        <span className="d-none d-sm-block">Accept</span>*/}
//                         {/*    </button>*/}
//                         {/*</div>*/}
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
// }
//
// export default Popup
