import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";
import HistoryItem from "sharedComponents/historyItem";
import Pagination from "sharedComponents/pagination";
import {Response} from "utils/common";
import {isEmpty} from "lodash"
import Spinner from "sharedComponents/spinner";

const HistoryPanel = props => {
    const {t} = useTranslation('common');
    const [history, setHistory] = useState([]);
    const [renderKey, setRenderKey] = useState(0);
    const isFirstRun = useRef(true);
    const [loading, setLoading] = useState(true)

    const getData = async (params) => {
        const response = await props.getData(params)
        const {list, totalElements} = Response.getAPIData(response);
        setHistory(list);
        setLoading(false);
        return {
            totalItem: totalElements
        }
    }

    useEffect(() => {

        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        setRenderKey(renderKey + 1)
    }, [props.watchForReload])

    return (
        <div className="card shadow-none">
            <div className="card-header d-flex justify-content-between align-items-center rounded-0 py-0 pr-1 order-1">
                <div className="task-header d-flex justify-content-start align-items-center">
                    <h4 className="content-header-title mb-0 pt-50">{t('history.editingHistory')}</h4>
                </div>
                <a onClick={() => props.setShowHistory(false)} className="avatar btn-avatar">
                    <i className="fal fa-long-arrow-right fa-lg"/>
                </a>
            </div>
            <Pagination pageSize={25} getData={getData} renderKey={renderKey}/>
            <div className="card-body card-scroll pt-50 py-0 mb-0 order-2">
                <Spinner loading={loading}>
                    {
                        !isEmpty(history) ? <div className="widget-timeline">
                                {props.topForm && props.topForm.length > 0 && <div className="mb-1 mx-n50 border-bottom">
                                    {props.topForm}
                                </div>}
                                <ul>
                                    {
                                        history.map((item, index) => {
                                            return <HistoryItem data={item} key={index} target={props.target}
                                                                customTranslation={props.customTranslation}/>
                                        })
                                    }
                                </ul>
                            </div> :
                            <div className="widget-timeline">
                                <ul>
                                    <li className="timeline-items">{t('common.noData')}</li>
                                </ul>
                            </div>
                    }
                </Spinner>
            </div>
        </div>
    )
}

HistoryPanel.propTypes = {
    getData: PropTypes.func,
    target: PropTypes.string,
    setShowHistory: PropTypes.func,
    customTranslation: PropTypes.object,
    watchForReload: PropTypes.any,
    topForm: PropTypes.array
};

HistoryPanel.defaultProps = {
    watchForReload: null
};

export default HistoryPanel;
