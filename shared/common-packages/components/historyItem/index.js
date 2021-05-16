import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {HISTORY_ACTION} from "globalConstants/common";
import filters from "utils/filters";
import {useTranslation} from "react-i18next";
import {isEmpty, includes} from "lodash";

const SPECIAL_FIELDS = ['PrimaryRole', 'SecondaryRole']

const HistoryItem = props => {
    const {t} = useTranslation('common');
    const data = props.data;
    const history = {
        entity: data?.fullName,
        action: data?.action,
        field: data?.field,
        target: data.target || props.target,
        from: data?.oldValue,
        to: data?.newValue,
        at: data?.createdAt,
        type: data?.type,
        reason: data?.reason,
        customData: data?.customData,
        translatedAction: '',
        translatedField: ''
    };

    if (!data.action) {
        return ''
    }

    const doMappedData = () => {
        if (!isEmpty(props.mappedData) && data.field && props.mappedData[data.field]) {
            const mappedEntity = props.mappedData[data.field];
            if (history.from) {
                const mappedFrom = mappedEntity.data.find(item => {
                    return item[mappedEntity.value] === history.from
                })
                history.from = mappedFrom ? mappedFrom[mappedEntity.label] : history.from
            }

            if (history.to) {
                const mappedFrom = mappedEntity.data.find(item => {
                    return item[mappedEntity.value] === history.to
                })
                history.to = mappedFrom ? mappedFrom[mappedEntity.label] : history.to
            }
        }
    }

    // doMappedData();

    const action = history.action.toLowerCase();
    history.translatedAction = props.customTranslation[action] || t(`history.${action}`)
    history.translatedField = t(`history.${history.field}`);

    const isSpecialField = (field) => {
        return includes(SPECIAL_FIELDS, field);
    }

    const Bottom = () => {
        return <div className="timeline-subtitle">
            <i className="fal fa-clock pr-25"/> {filters.dateTime(history.at)}
        </div>
    }

    const simpleTemplate = () => {
        const isString = typeof history?.customData === 'string'
        if (!isString) {
            console.error('Custom data with simple history template must be a string')
        }
        return <li className="timeline-items a">
            <div className="timeline-title font-weight-normal">
                <b>{history.entity || t('history.unNamed')}</b>
                <span className="px-25">{isString && history.customData}</span>
            </div>
            <Bottom/>
        </li>
    }

    const commonActionTemplate = () => {
        return <li className="timeline-items a">
            <div className="timeline-title font-weight-normal">
                <b>{history.entity || t('history.unNamed')}</b>
                <span className="px-25">{history.translatedAction}</span>
                {history.action === 'CREATED' ? <span>{history.target}.</span> : <a>{history.target}.</a>}
                {
                    history.reason && <fieldset>
                        <span><i className="pr-25">{t('history.historyReason')}:</i></span><span>{history.reason}</span>
                    </fieldset>
                }
            </div>
            <Bottom/>
        </li>
    }

    const inheritActionTemplate = (injectedTemplate = null) => {
        return <li className="timeline-items b">
            <div className="timeline-title font-weight-normal">
                <b>{history.entity || t('history.unNamed')}</b>
                <span
                    className="px-25">{history.action === 'CREATED' ? t('history.added') : history.translatedAction}</span>
                {
                    history.field ? <b>{history.translatedField}.</b> : <b>{history.target}.</b>
                }
                {
                    history.from && <fieldset>
                        <span>{history.from}</span>
                    </fieldset>
                }
                {
                    history.to && <fieldset>
                        <span>{history.to}</span>
                    </fieldset>
                }
                {
                    injectedTemplate
                }
            </div>
            <Bottom/>
        </li>
    }

    const updatedActionWithValueTemplate = () => {
        return <li className="timeline-items c">
            <div className="timeline-title font-weight-normal">
                <b>{history.entity || t('history.unNamed')}</b>
                <span className="px-25 text-lowercase">{t('history.historyChanged')}</span>
                <b>{history.translatedField}</b>
                <span
                    className="px-25">{t('history.updatedWithFrom')} {t('history.updatedWithValueFrom', history)} {t('history.updatedWithTo')} {t('history.updatedWithValueTo', history)}.</span>
            </div>
            <Bottom/>
        </li>
    }

    const updatedActionTemplate = () => {
        return <li className="timeline-items d">
            <div className="timeline-title font-weight-normal">
                <b>{history.entity || t('history.unNamed')}</b>
                <span className="px-25">{history.translatedAction}</span>
                <b>{history.translatedField}.</b>
                {
                    (isSpecialField(history.field) && history.to) && <p>{history.to}</p>
                }
                {history.from && <fieldset className='d-flex flex-column'>
                    <i className="pr-25">{t('history.previousContent')}:</i>
                    <span>{history.from}</span>
                </fieldset>}
            </div>
            <Bottom/>
        </li>
    }

    const customHistoryTemplate = () => {

        const CustomMessage = () => {
            let emptyTemplate = <></>
            switch (history.field) {
                case 'Permission': {
                    const target = history.customData?.roleName
                    const dataValue = history.customData?.permissionName
                    return <>
                        <span className="px-25">
                            {history.translatedAction} {history.translatedField} {t('common.of')} <b>{target}</b>.
                        </span>
                        <p>{dataValue}</p>
                    </>
                }
                case 'Hierarchy': {
                    const target = history.customData?.roleName
                    const dataValue = history.customData?.hierarchyName
                    return <>
                        <span className="px-25">
                            {history.translatedAction} {history.translatedField} {t('common.of')} <b>{target}</b>.
                        </span>
                        <p>{history.to && <fieldset className='d-flex flex-column'>
                            <i className="pr-25">{dataValue}</i>
                            <span>{history.to}</span>
                        </fieldset>}</p>
                        {history.from && <fieldset className='d-flex flex-column'>
                            <i className="pr-25">{t('history.previousValue')}:</i>
                            <span>{history.from}</span>
                        </fieldset>}
                    </>
                }
                case 'SecondaryRole': {
                    break
                }
                case 'Document': {
                    const target = history.customData?.documentName
                    const dataValue = history.customData?.fileName
                    return <>
                        <span className="px-25">
                            {history.translatedAction} {history.translatedField} <b>{dataValue}</b> {t('common.in')} <b>{target}</b>.
                        </span>
                    </>
                }
                default:
                    return emptyTemplate
            }
        }

        return (
            <li className="timeline-items d">
                <div className="timeline-title font-weight-normal">
                    <b>{history.entity || t('history.unNamed')}</b>

                    <CustomMessage/>

                    {
                        (isSpecialField(history.field) && history.to) && <p>{history.to}</p>
                    }
                </div>
                <Bottom/>
            </li>
        )
    }

    const customDataTemplate = () => {

        const CustomMessage = () => {
            let emptyTemplate = <></>
            switch (history.field) {
                case 'SecondaryRole': {
                    if (history.action === HISTORY_ACTION.CREATED) {
                        return <>
                            {
                                inheritActionTemplate(history.customData.affectedDate ? <fieldset>
                                    <span>{t('history.affectedDate')}: {history.customData.affectedDate}</span>
                                </fieldset> : null)
                            }
                        </>
                    }
                    if (history.action === HISTORY_ACTION.UPDATED) {
                        return <li className="timeline-items d">
                            <div className="timeline-title font-weight-normal">
                                <b>{history.entity || t('history.unNamed')}</b>
                                <span className="px-25">{history.translatedAction}</span>
                                <b>{history.translatedField}.</b>
                                {
                                    (isSpecialField(history.field) && history.to) && <fieldset>
                                        <span>{history.to}</span>
                                    </fieldset>
                                }
                                {
                                    history.customData.affectedDateNew && <fieldset>
                                        <span>{t('history.affectedDate')}: {history.customData.affectedDateNew}</span>
                                    </fieldset>
                                }
                                <p></p>
                                {history.from && <fieldset className='d-flex flex-column'>
                                    <i className="pr-25">{t('history.previousContent')}:</i>
                                    <span>{history.from}</span>
                                    {
                                        history.customData.affectedDateOld && <span>{t('history.affectedDate')}: {history.customData.affectedDateOld}</span>
                                    }
                                </fieldset>}
                            </div>
                            <Bottom/>
                        </li>
                    }

                    break
                }
                default:
                    return emptyTemplate
            }
        }

        return <CustomMessage/>
    }

    const isSelectBox = (type) => {
        return type === 'SELECT_BOX';
    }

    switch (data.action) {
        case HISTORY_ACTION.CREATED:
        case HISTORY_ACTION.BLOCKED:
        case HISTORY_ACTION.UNBLOCKED:
        case HISTORY_ACTION.DELETED: {
            if (history.customData && typeof history.customData === 'object') {
                return customDataTemplate()
            }
            if (history.field) {
                return inheritActionTemplate()
            } else {
                return commonActionTemplate()
            }
        }
        case HISTORY_ACTION.UPDATED:
            if (history.customData && typeof history.customData === 'object') {
                return customDataTemplate()
            }
            if (history.field && history.from && history.to && isSelectBox(history.type)) {
                return updatedActionWithValueTemplate()
            }

            if (history.field) {
                return updatedActionTemplate()
            }

            return commonActionTemplate()
        case HISTORY_ACTION.TURNED_OFF:
        case HISTORY_ACTION.TURNED_ON:
        case HISTORY_ACTION.HIERARCHY_UPDATED:
        case HISTORY_ACTION.DOCUMENT_DELETED:
        case HISTORY_ACTION.DOCUMENT_UPLOADED:
            return customHistoryTemplate()
        default: {
            return (history.customData && typeof  history.customData === 'string') ? simpleTemplate() : commonActionTemplate()
        }
    }
}

HistoryItem.propTypes = {
    data: PropTypes.object,
    target: PropTypes.string,
    mappedData: PropTypes.object,
    customTranslation: PropTypes.object
};

HistoryItem.defaultProps = {
    data: {},
    mappedData: {},
    customTranslation: {}
};

export default HistoryItem;
