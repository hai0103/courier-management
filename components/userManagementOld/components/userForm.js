import SelectBox from "sharedComponents/selectBox";
import {ROUTES, SYSTEM_PERMISSIONS} from "constants/common";
import _, {isEmpty} from "lodash";
import {useRouter} from 'next/router';
import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useToasts} from 'react-toast-notifications';
import {UserApi} from "services/user";
import {FormControl, Response, Utility} from "utils/common";
import FormRules from "utils/formRules";
import UserRoleModal from "./userRoleModal";
import {DepartmentApi} from "services/department";
import {PositionApi} from "services/position";
import {InlineInput} from "sharedComponents/formControl";
import HistoryPanel from "sharedComponents/historyPanel";
import SocketHelpers from "utils/socketHelpers";
import {useSocket} from "providers/socket";
import {confirmation} from "utils/helpers";
import Badge from "sharedComponents/blocks/badge";
import {useGate} from "providers/accessControl";
import ConcurrentlyModal from "./concurrentlyModal";
import StatusSwitcher from "../../statusSwitcher";
import filters from "utils/filters";
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";
import More from "sharedComponents/more";
import {getUserProfile, storeUserProfile} from "utils/localStorage";

function UserForm(props) {
    const {register, errors, handleSubmit, setError, formState} = useForm();
    const {addToast} = useToasts();
    const {t} = useTranslation('common');
    const router = useRouter();
    const [isEdit] = useState(() => {
        return !(_.isEmpty(props.userId));
    });
    const [readOnly, setReadOnly] = useState(props.readOnly);
    const [detail, setDetail] = useState(props.detail);
    const [secondaryRoles, setSecondaryRoles] = useState([]);
    const [secondaryRoleDetail, setSecondaryRoleDetail] = useState({});
    const [systemRoleId, setSystemRoleId] = useState(detail?.systemRoleId);
    const [showModalRole, setShowModalRole] = useState(false);
    const [showSecondaryModalRole, setShowSecondaryModalRole] = useState(false);
    const [secondaryModalRoleKey, setSecondaryModalRoleKey] = useState(1);
    const [primaryModalRoleKey, setPrimaryModalRoleKey] = useState(100);
    const [showEditSecondaryModalRole, setShowEditSecondaryModalRole] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [companyId, setCompanyId] = useState(detail?.companyId);
    const [departmentId, setDepartmentId] = useState(detail?.departmentId);
    const [functionId, setFunctionId] = useState(detail?.functionId);
    const [roleConstraint, setRoleConstraint] = useState([])
    const [roleId, setRoleId] = useState(detail?.roleId);
    const [positionId, setPositionId] = useState(detail?.positionId);
    const {socketClient} = useSocket();
    const [allows] = useGate()
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [listDepartment, setListDepartment] = useState([]);
    const [listFunction, setListFunction] = useState([]);
    const [errCompany, setErrCompany] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [errDepartment, setErrDepartment] = useState(false);
    const [errMessDepartment, setErrMessDepartment] = useState('');
    const [errFunction, setErrFunction] = useState(false);
    const [errPosition, setErrPosition] = useState(false);
    const [errRole, setErrRole] = useState(false);
    const allowsToUpdate = allows(SYSTEM_PERMISSIONS.UPDATE_USER)
    const allowsToUpdateRole = allows(SYSTEM_PERMISSIONS.ASSIGN_SYSTEM_PERMISSION)
    const onClose = () => {
        router.push(ROUTES.USER);
    }

    useEffect(() => {
        props.companies.forEach(item => {
            if (!item.status) {
                item.isDisabled = true
            }
        })
    }, [])

    useEffect(() => {
        if (detail && detail.id) {
            const loggedUser = getUserProfile();
            if(loggedUser && loggedUser.id === detail.id) {
                storeUserProfile(detail);
            }
        }
    }, [detail])

    if (isEdit) {
        useEffect(() => {
            getSecondaryRoles().catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}))
        }, []);
    }

    if (!isEdit) {
        useEffect(() => {
            getListDepartment(companyId).catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}));
        }, [companyId]);
    }

    useEffect(() => {
        getListFunction(departmentId).catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}));
    }, [companyId, departmentId]);

    useEffect(() => {
        const internalRoleConstraint = [];
        if (!isEmpty(detail)) {
            internalRoleConstraint.push(generateConstraint(detail));
        }
        if (!isEmpty(secondaryRoles)) {
            secondaryRoles.forEach(item => {
                internalRoleConstraint.push(generateConstraint(item));
            })
        }
        if (!isEmpty(internalRoleConstraint)) {
            setRoleConstraint(internalRoleConstraint)
        }
    }, [secondaryRoles, detail]);

    const generateConstraint = (item) => {
        return `${item?.companyId}-${item?.departmentId}-${item?.functionId}`
    }

    const statusMapping = (status) => {
        const mapping = {
            1: {
                label: t('status.active'),
                bg: 'success',
            },
            2: {
                label: t('status.waitActive'),
                bg: 'warning',
            },
            0: {
                label: t('status.block'),
                bg: 'danger',
            }
        }

        return mapping[status] || [];
    };

    const checkData = () => {
        let isValid = true

        if (!companyId) {
            setErrCompany(true);
            isValid = false
        }
        if (!departmentId) {
            setErrDepartment(true);
            isValid = false
        }
        if (!functionId) {
            setErrFunction(true);
            isValid = false
        }
        if (!roleId) {
            setErrRole(true);
            isValid = false
        }
        if (!positionId) {
            setErrPosition(true);
            isValid = false
        }

        return isValid
    }

    const getSecondaryRoles = async (e) => {
        const response = await UserApi.getSecondaryRoles(detail?.id);
        if (Response.isSuccessAPI(response)) {
            const data = Response.getAPIData(response);
            setSecondaryRoles(data || []);
        } else {
            addToast(Response.getAPIError(response), {appearance: 'error'});
        }
    }

    const getListDepartment = async (e) => {
        if (companyId) {
            const data = {
                pageSize: 500,
                pageNumber: 0,
                companyId: companyId,
                status: 1,
                sort: [{
                    key: "departmentNameSort",
                    asc: true
                }],
            }

            const response = await DepartmentApi.getList(data);
            const list = Response.getAPIData(response).content;
            setListDepartment(companyId ? list : []);
        }
    }

    const getListFunction = async (e) => {
        if (departmentId) {
            const response = await DepartmentApi.getListFunctionById(departmentId)
            const list = Response.getAPIData(response)
            list.forEach(item => {
                if (!item.status) {
                    item.isDisabled = true
                }
            });
            setListFunction(departmentId ? list : []);
        }
    }

    const save = async (data) => {
        const payload = {
            ...data,
            companyId,
            departmentId,
            functionId,
            roleId,
            positionId
        }
        const payloadEdit = {
            email: detail?.email,
            fullName: detail?.fullName,
            phoneNumber: detail?.phoneNumber,
            ...data
        }

        try {
            isEdit ? await onSubmitUpdate(Utility.trimObjValues(payloadEdit)) : await onSubmitCreate(Utility.trimObjValues(payload));
        } catch (error) {
            if (error.response.data?.errorCode === 'AUTH.USER_NAME_EXISTED') {
                setError('userName', {
                    type: 'manual',
                    message: t('createUser.notifyUserNameErrCreate'),
                })
            } else if (error.response.data?.errorCode === 'AUTH.EMAIL_EXISTED') {
                setError('email', {
                    type: 'manual',
                    message: error.response.data?.message[0]
                })
            } else if (error.response.data?.errorCode === 'ADMIN.DEPARTMENT_NOT_BELONGED_TO_COMPANY') {
                setErrDepartment(true);
                setErrMessDepartment(error.response.data?.message[0])
            } else {
                addToast(Response.getErrorMessage(error), {appearance: 'error'});
            }
        }
    }

    const onSubmitCreate = async (data) => {
        if (checkData()) {
            const payload = {
                ...data,
                userName: data.userName.toLowerCase(),
            };
            const response = await UserApi.create(payload);
            if (Response.isSuccessAPI(response)) {
                const entityId = Response.getAPIData(response);
                SocketHelpers.fastSubscribe(`/topic/user-added/${entityId}`, () => {
                    addToast(t('common.message.createSuccess'), {appearance: 'success'})
                    onClose();
                }, socketClient);
            } else {
                addToast(Response.getAPIError(response), {appearance: 'error'});
            }
        }
    }

    const onSubmitUpdate = async (data) => {
        if (data.email !== detail.email) {
            const res = await UserApi.updateEmail(props.userId, {email: data.email})
            if (Response.isSuccessAPI(res)) {
                addToast(t('common.message.editSuccess'), {appearance: 'success'});
            } else {
                addToast(Response.getAPIError(res), {appearance: 'error'});
            }
        } else {
            const response = await UserApi.update(props.userId, data);
            if (Response.isSuccessAPI(response)) {
                addToast(t('common.message.editSuccess'), {appearance: 'success'});
                const responseData = Response.getAPIData(response);
                updateDetail(responseData);
                setReadOnly(true)
            } else {
                addToast(Response.getAPIError(response), {appearance: 'error'});
            }
        }
    };

    const updateSystemRole = async () => {
        const payload = {
            systemRoleId: systemRoleId,
        }
        try {
            const response = await UserApi.updateSystemRole(props.userId, payload);
            if (Response.isSuccessAPI(response)) {
                addToast(t('common.message.editSuccess'), {appearance: 'success'});
                const responseData = Response.getAPIData(response);
                updateDetail(responseData)
            }
        } catch (error) {
            addToast(Response.getAPIError(error.response), {appearance: 'error'});
        }

    }

    const updateUserRole = async (payload) => {
        const response = await UserApi.updateRole(props.userId, payload);
        if (Response.isSuccessAPI(response)) {
            addToast(t('common.message.editSuccess'), {appearance: 'success'});
            const responseData = Response.getAPIData(response);
            updateDetail(responseData)
            setShowModalRole(false);
            setPrimaryModalRoleKey(primaryModalRoleKey + 1)
        } else {
            addToast(Response.getAPIError(response), {appearance: 'error'});
        }
    }

    const createUserSecondaryRole = async (payload) => {
        const response = await UserApi.createSecondaryRole(props.userId, payload);
        if (Response.isSuccessAPI(response)) {
            addToast(t('common.message.editSuccess'), {appearance: 'success'});
            setShowSecondaryModalRole(false)
            setSecondaryModalRoleKey(secondaryModalRoleKey + 1)
            setTimeout(() => {
                getSecondaryRoles().catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}));
            }, 1000)
        } else {
            addToast(Response.getAPIError(response), {appearance: 'error'});
        }
    }

    const updateUserSecondaryRole = async (payload, id) => {
        const response = await UserApi.updateSecondaryRole(props.userId, id, payload);
        if (Response.isSuccessAPI(response)) {
            addToast(t('common.message.editSuccess'), {appearance: 'success'});
            setShowEditSecondaryModalRole(false)
            setSecondaryModalRoleKey(secondaryModalRoleKey + 1)
            setTimeout(() => {
                getSecondaryRoles().catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}));
            }, 1000)
        } else {
            addToast(Response.getAPIError(response), {appearance: 'error'});
        }
    }

    const removeSecondaryRole = async (roleId) => {
        const response = await UserApi.deleteSecondaryRole(props.userId, roleId);
        if (Response.isSuccessAPI(response)) {
            addToast(t('common.message.editSuccess'), {appearance: 'success'});
            setTimeout(() => {
                getSecondaryRoles().catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}));
            }, 1000)
        } else {
            addToast(Response.getAPIError(response), {appearance: 'error'});
        }
    }

    const updateDetail = (responseData) => {
        if (responseData) {
            const mergedData = {
                ...detail,
                ...responseData
            }

            setDetail(mergedData);
        }
    }

    const resetSecondaryRoleDetail = () => {
        setSecondaryRoleDetail({});
    }

    const resendActiveUser = async (id) => {
        UserApi.resendEmailActiveUser(id).then((response) => {
            if (Response.isSuccess(response)) {
                addToast(t('common.message.resendActiveSuccess'), {appearance: 'success'})
            } else {
                addToast(Response.getAPIError(response), {appearance: 'error'});
            }
        }).catch(error => {
            addToast(Response.getErrorMessage(error), {appearance: 'error'})
        });
    }

    const loginNameControl = () => {
        const validation = FormControl.getValidation('userName', errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            // minLength: FormRules.minLength(6),

            pattern: FormRules.isName(),
            required: FormRules.required()
        };

        return {
            classNames,
            rules,
            ...validation
        }
    }
    const fullNameControl = () => {
        const validation = FormControl.getValidation('fullName', errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            // pattern: FormRules.isName(),
            // minLength: FormRules.minLength(6),
            required: FormRules.required()
        };

        return {
            classNames,
            rules,
            ...validation
        }
    }

    const phoneControl = () => {
        const validation = FormControl.getValidation('phoneNumber', errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {};

        return {
            classNames,
            rules,
            ...validation
        }
    }

    const emailControl = () => {
        const validation = FormControl.getValidation('email', errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            required: FormRules.required(),
            pattern: FormRules.isEmail()
        };
        return {
            classNames,
            rules,
            ...validation
        }
    };

    const statusHandler = async (payload, entity) => {
        try {
            const response = await UserApi.updateStatus(entity?.id, payload);
            if (Response.isSuccessAPI(response)) {
                const message = entity?.status ? t('common.message.requestBlockSuccess') : t('common.message.unblockSuccess')
                addToast(message, {appearance: 'success'})
                setShowModalConfirm(false)
                SocketHelpers.fastSubscribe(`/topic/user-updated-status/${entity?.id}`, () => {
                    updateDetail({status: payload.status})
                }, socketClient);
            } else {
                addToast(Response.getAPIError(response), {appearance: 'error'});
            }
        } catch (error) {
            addToast(Response.getErrorMessage(error), {appearance: 'error'});
        }
    };

    const historyOptions = () => {
        const getData = async (params) => {
            try {
                const response = await UserApi.getHistory(detail?.id, params);
                if (Response.isSuccessAPI(response)) {
                    return response;
                } else {
                    addToast(t('common.message.getHistoryErr'), {appearance: 'error'});
                }
            } catch (error) {
                addToast(Response.getErrorMessage(error), {appearance: 'error'});
            }
        };

        return {
            getData,
            setShowHistory,
            target: t('usersManagement.target'),
            customTranslation: {
                blocked: t('history.userBlocked'),
                unblocked: t('history.userUnblocked'),
            }
        }
    }

    const blockUserComponent = () => {
        return <>
            {
                detail?.status !== "2" &&
                (detail?.status ? <li className="border-separate">
                        <button title="Khoá" className="avatar btn-avatar"
                                disabled={!allows(SYSTEM_PERMISSIONS.BLOCK_UNBLOCK_USER)}
                                onClick={() => {
                                    setSelectedItem(detail);
                                    setShowModalConfirm(true)
                                }}
                                type="button"

                        >
                            <i className="fal fa-lock"/>
                        </button>
                    </li> :
                    <li className="border-separate">
                        <button title="Mở khoá" className="avatar btn-avatar"
                                disabled={!allows(SYSTEM_PERMISSIONS.BLOCK_UNBLOCK_USER)}
                                onClick={() => {
                                    setSelectedItem(detail);
                                    setShowModalConfirm(true)
                                }}
                                type="button"
                        >
                            <i className="fal fa-unlock"/>
                        </button>
                    </li>)
            }
        </>
    }

    const statusToTitle = (item) => {
        return item.isAffected ? 'Đang hiệu lực' : ''
    }

    return (
        <div className="animated slideInRight">
            <div className="row">
                <div className="col-md-12">
                    <div className="card card-form card-no-border mb-0 shadow-none max-height">
                        <div className={'card-header card-header-main bg-light-primary' + (!isEdit ? '' : ' card-header-main-o')}>
                            <h3 className="content-header-title mb-0">
                                {
                                    !isEdit ? t('createUser.title1') : <>
                                        {detail?.fullName}
                                    </>
                                }
                            </h3>
                            {
                                !isEdit ? '' : <>
                                    <Badge isInForm {...statusMapping(detail?.status)} />
                                </>
                            }
                            <div className="heading-elements">
                                {
                                    (isEdit) ?
                                        <ul className="list-inline">
                                            <li className="pl-1">
                                                <label onClick={() => setShowSecondaryModalRole(true)}
                                                       id="menu-toggle-sm"
                                                       className="opacity-normal">
                                                    <a title={t('usersManagement.userDetail.createSecondaryRole')}
                                                       className='avatar btn-avatar'>
                                                        {/*<i className="far fa-history"/>*/}
                                                        <i className="fal fa-id-card"/>
                                                    </a>
                                                </label>
                                            </li>
                                            {
                                                detail.status === "2" && <li className="border-separate">
                                                    <button className="avatar btn-avatar"
                                                            title={t('usersManagement.actionResendActive.title')}
                                                            onClick={() => resendActiveUser(detail.id)}
                                                            type='button'
                                                    >
                                                        <i className="fal fa-sync-alt"/>
                                                    </button>
                                                </li>
                                            }
                                            {
                                                blockUserComponent()
                                            }
                                            <li className="pl-1">
                                                <label onClick={() => setShowHistory(true)} id="menu-toggle-sm"
                                                       className="opacity-normal">
                                                    <a title={t('history.editingHistoryTitle')}
                                                       className={'avatar btn-avatar' + (showHistory ? ' active' : '')}>
                                                        <i className="fal fa-history"/>
                                                    </a>
                                                </label>
                                            </li>
                                        </ul>
                                        :
                                        <>
                                            <button onClick={() => onClose()}
                                                    className="btn btn-outline-primary mr-50">
                                                {t('common.button.cancel')}
                                            </button>
                                            <button onClick={handleSubmit(save, checkData)}
                                                    className="btn btn-primary"
                                                    disabled={!allows(SYSTEM_PERMISSIONS.CREATE_USER)}
                                            >
                                                {!isEdit ? t('common.button.create') : t('common.button.save')}
                                            </button>
                                        </>
                                }
                            </div>
                        </div>
                        {
                            isEdit &&
                            <div className={'slide-menu slide-menu-sm border-left' + (showHistory ? ' open' : '')}>
                                {showHistory && <HistoryPanel {...historyOptions()} />}
                            </div>
                        }
                        <div className="slide-content">
                            <div className="card-content card-scroll">
                                <FormProvider formState={formState}>
                                    <form onSubmit={handleSubmit(save)}>
                                        <div className="card card-section">
                                            <div className="card-header">
                                                <div
                                                    className="form-section d-flex align-items-center justify-content-between">
                                                    <h5 className="mb-0">{t('createUser.overView')}</h5>
                                                </div>
                                            </div>
                                            <div className="card-body px-0">
                                                <div className="form-row">
                                                    {/* Tên đăng nhập */}
                                                    <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                        <fieldset className="form-group form-group-sm">
                                                            <label>
                                                                {t('createUser.loginName')} <sup
                                                                className="text-danger">*</sup>
                                                            </label>
                                                            <article>
                                                                <div className="position-relative has-icon-right">
                                                                    {
                                                                        isEdit ? <InlineInput
                                                                                className={loginNameControl().classNames}
                                                                                defaultValue={detail?.userName}
                                                                                disabled={true}
                                                                            /> :
                                                                            <input id="inputLoginName"
                                                                                   className={loginNameControl().classNames}
                                                                                   placeholder={t('createUser.loginNamePlaceHolder')}
                                                                                   name="userName"
                                                                                   ref={register(loginNameControl().rules)}
                                                                                   readOnly={readOnly || isEdit}
                                                                                   defaultValue={detail?.userName}
                                                                            />
                                                                    }
                                                                    <InvalidFeedBack
                                                                        message={loginNameControl().errorMessage}/>
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    {/* Họ và tên */}
                                                    <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                        <fieldset className="form-group form-group-sm">
                                                            <label>
                                                                {t('createUser.fullName')} <sup
                                                                className="text-danger">*</sup>
                                                            </label>
                                                            <article>
                                                                <div className="position-relative has-icon-right">
                                                                    {isEdit ?
                                                                        <InlineInput id="inputName"
                                                                                     className={fullNameControl().classNames}
                                                                                     type="text"
                                                                                     defaultValue={detail?.fullName}
                                                                                     placeholder={t('createUser.fullNamePlaceHolder')}
                                                                                     name="fullName"
                                                                                     register={register(fullNameControl().rules)}
                                                                                     handleSubmit={handleSubmit(save)}
                                                                                     disabled={!allowsToUpdate}
                                                                        />
                                                                        :
                                                                        <input id="inputName"
                                                                               className={fullNameControl().classNames}
                                                                               placeholder={t('createUser.fullNamePlaceHolder')}
                                                                               name="fullName"
                                                                               ref={register(fullNameControl().rules)}
                                                                               defaultValue={detail?.fullName}
                                                                               readOnly={readOnly}
                                                                        />}
                                                                    <InvalidFeedBack
                                                                        message={fullNameControl().errorMessage}/>
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    {/* Email */}
                                                    <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                        <fieldset className="form-group form-group-sm">
                                                            <label>
                                                                {t('createUser.email')} <sup
                                                                className="text-danger">*</sup>
                                                            </label>
                                                            <article>
                                                                <div className="position-relative has-icon-right">
                                                                    {
                                                                        (isEdit) ?
                                                                            <InlineInput defaultValue={detail?.email}
                                                                                         className={emailControl().classNames}
                                                                                         placeholder={t('createUser.emailPlaceHolder')}
                                                                                         name="email"
                                                                                         register={register(emailControl().rules)}
                                                                                         readOnly={detail?.status != 2 && isEdit}
                                                                                         handleSubmit={handleSubmit(save)}
                                                                                         inlineClassName="text-lowercase"
                                                                                         disabled={!allowsToUpdate || detail?.status != 2}
                                                                            /> :
                                                                            <input type="email" id="email"
                                                                                   className={emailControl().classNames}
                                                                                   placeholder={t('createUser.emailPlaceHolder')}
                                                                                   name="email"
                                                                                   ref={register(emailControl().rules)}
                                                                                   defaultValue={detail?.email}
                                                                                   readOnly={detail?.status != 2 && isEdit}
                                                                            />
                                                                    }
                                                                    <InvalidFeedBack
                                                                        message={emailControl().errorMessage}/>
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    {/* Điện thoại */}
                                                    <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                        <fieldset className="form-group form-group-sm">
                                                            <label>
                                                                {t('createUser.phone')}
                                                            </label>
                                                            <article>
                                                                <div className="position-relative has-icon-right">
                                                                    {(readOnly && isEdit) ?
                                                                        <InlineInput id="inputPhone"
                                                                                     defaultValue={detail?.phoneNumber}
                                                                                     className={phoneControl().classNames}
                                                                                     placeholder={t('createUser.phonePlaceHolder')}
                                                                                     name="phoneNumber"
                                                                                     register={register(phoneControl().rules)}
                                                                                     handleSubmit={handleSubmit(save)}
                                                                                     disabled={!allowsToUpdate}
                                                                        />
                                                                        :
                                                                        <input type="text"
                                                                               id="inputPhone"
                                                                               className={phoneControl().classNames}
                                                                               placeholder={t('createUser.phonePlaceHolder')}
                                                                               name="phoneNumber"
                                                                               ref={register(phoneControl().rules)}
                                                                               defaultValue={detail?.phoneNumber}
                                                                               readOnly={readOnly}
                                                                        />}
                                                                    <InvalidFeedBack
                                                                        message={phoneControl().errorMessage}/>
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    {/*Quyền hệ thống*/}
                                                    {(readOnly && isEdit) ?
                                                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                            <fieldset className="form-group form-group-sm">
                                                                <label>
                                                                    {t('createUser.titlePermission')}
                                                                </label>
                                                                <article>
                                                                    <div className="position-relative has-icon-right">
                                                                        <InlineInput
                                                                            type="select"
                                                                            options={props.roles}
                                                                            optionLabel="name"
                                                                            optionValue="id"
                                                                            handleSubmit={() => updateSystemRole()}
                                                                            onChange={(e) => {
                                                                                setSystemRoleId(e);
                                                                            }}
                                                                            defaultValue={detail?.systemRoleId}
                                                                            defaultLabel={detail?.systemRoleName}
                                                                            placeholder={t('createUser.titlePermissionPlaceHolder')}
                                                                            disabled={!allowsToUpdateRole}
                                                                        >
                                                                        </InlineInput>
                                                                    </div>
                                                                </article>
                                                            </fieldset>
                                                        </div> :
                                                        null
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card card-section form-edit-header">
                                            <div className="card-header">
                                                <div
                                                    className="form-section d-flex align-items-center justify-content-between">
                                                    <h5 className="mb-0">{t('createUser.under')}</h5>
                                                </div>
                                            </div>
                                            <div className="card-body px-0">
                                                <div className={isEdit ? "form-row" : "form-row"}>
                                                    {/* Công ty */}
                                                    <div
                                                        className={isEdit ? "col-3" : "col-xl-3 col-lg-4 col-md-6 col-12"}>
                                                        <fieldset
                                                            className="form-group form-group-sm">
                                                            <label>{t('createUser.company')} {!isEdit &&
                                                            <sup className="text-danger">*</sup>}</label>
                                                            <article>
                                                                <div
                                                                    className={`${errCompany ? 'position-relative has-icon-right is-invalid' : 'position-relative has-icon-right'}`}>
                                                                    {isEdit ?
                                                                        <InlineInput
                                                                            defaultValue={detail?.companyName}
                                                                            placeholder={t('createUser.placeholderCompany')}
                                                                            disabled={true}
                                                                        >
                                                                        </InlineInput>
                                                                        :
                                                                        <SelectBox
                                                                            options={props.companies}
                                                                            optionLabel="companyName"
                                                                            optionValue="id"
                                                                            isDisabled={readOnly}
                                                                            onChange={(value) => {
                                                                                setCompanyId(value);
                                                                                setDepartmentId(null);
                                                                                setErrCompany(false);
                                                                            }}
                                                                            placeholder={t('createUser.placeholderCompany')}
                                                                            value={companyId || null}
                                                                            error={errCompany}
                                                                            errMess={t('createUser.reqMess')}
                                                                        >
                                                                        </SelectBox>}
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    {/* Phòng ban */}
                                                    <div
                                                        className={isEdit ? "col-3" : "col-xl-3 col-lg-4 col-md-6 col-12"}>
                                                        <fieldset
                                                            className="form-group form-group-sm">
                                                            <label>{t('createUser.department')}{!isEdit &&
                                                            <sup className="text-danger">*</sup>}</label>
                                                            <article>
                                                                <div
                                                                    className={`${errDepartment ? 'position-relative has-icon-right is-invalid' : 'position-relative has-icon-right'}`}>
                                                                    {isEdit ?
                                                                        <InlineInput
                                                                            defaultValue={detail?.departmentName}
                                                                            placeholder={t('createUser.placeholderDepartment')}
                                                                            disabled={true}
                                                                        >
                                                                        </InlineInput>
                                                                        :
                                                                        <SelectBox
                                                                            options={listDepartment}
                                                                            optionLabel="departmentName"
                                                                            placeholder={t('createUser.placeholderDepartment')}
                                                                            optionValue="id"
                                                                            isDisabled={readOnly}
                                                                            onChange={(value) => {
                                                                                setDepartmentId(value);
                                                                                setErrDepartment(false);
                                                                                setErrMessDepartment('');
                                                                            }}
                                                                            value={departmentId || null}
                                                                            error={errDepartment}
                                                                            errMess={errMessDepartment ? errMessDepartment : t('createUser.reqMess')}
                                                                        >
                                                                        </SelectBox>}
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    {/* Chức năng */}
                                                    <div
                                                        className={isEdit ? "col-2" : "col-xl-2 col-lg-4 col-md-6 col-12"}>
                                                        <fieldset
                                                            className="form-group form-group-sm">
                                                            <label>{t('createUser.position')}{!isEdit &&
                                                            <sup className="text-danger">*</sup>}</label>
                                                            <article>
                                                                <div
                                                                    className={`${errFunction ? 'position-relative has-icon-right is-invalid' : 'position-relative has-icon-right'}`}>
                                                                    {isEdit ?
                                                                        <InlineInput
                                                                            defaultValue={detail.functionName}
                                                                            placeholder={t('createUser.placeholderPosition')}
                                                                            disabled={true}
                                                                        >
                                                                        </InlineInput>
                                                                        :
                                                                        <SelectBox
                                                                            options={listFunction}
                                                                            optionLabel="functionName"
                                                                            optionValue="id"
                                                                            isDisabled={readOnly}
                                                                            onChange={(value) => {
                                                                                setFunctionId(value);
                                                                                setErrFunction(false);
                                                                            }}
                                                                            placeholder={t('createUser.placeholderPosition')}
                                                                            value={functionId || null}
                                                                            error={errFunction}
                                                                            errMess={t('createUser.reqMess')}
                                                                        >
                                                                        </SelectBox>}
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    {/* Chức danh */}
                                                    <div
                                                        className={isEdit ? "col-2" : "col-xl-2 col-lg-4 col-md-6 col-12"}>
                                                        <fieldset
                                                            className="form-group form-group-sm">
                                                            <label>{t('createUser.titleRole')} {!isEdit &&
                                                            <sup className="text-danger">*</sup>}</label>
                                                            <article>
                                                                <div
                                                                    className={`${errPosition ? 'position-relative has-icon-right is-invalid' : 'position-relative has-icon-right'}`}>
                                                                    {
                                                                        isEdit ?
                                                                            <InlineInput
                                                                                type="text"
                                                                                defaultValue={detail?.positionName}
                                                                                disabled={true}
                                                                            >
                                                                            </InlineInput>
                                                                            :
                                                                            <SelectBox
                                                                                options={props.positionRoles}
                                                                                optionLabel="name"
                                                                                optionValue="id"
                                                                                isDisabled={readOnly}
                                                                                onChange={(value) => {
                                                                                    setPositionId(value);
                                                                                    setErrPosition(false);
                                                                                }}
                                                                                placeholder={t('createUser.titleRolePlaceHolder')}
                                                                                value={positionId || null}
                                                                                error={errPosition}
                                                                                errMess={t('createUser.reqMess')}
                                                                            >
                                                                            </SelectBox>}
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    {/* Vai trò */}
                                                    <div
                                                        className={isEdit ? "col-2" : "col-xl-2 col-lg-4 col-md-6 col-12"}>
                                                        <fieldset
                                                            className="form-group form-group-sm">
                                                            <label>{t('createUser.role')} {!isEdit &&
                                                            <sup className="text-danger">*</sup>}</label>
                                                            <article>
                                                                <div
                                                                    className={`${errRole ? 'position-relative has-icon-right is-invalid' : 'position-relative has-icon-right'}`}>
                                                                    {
                                                                        isEdit ?
                                                                            <InlineInput
                                                                                type="text"
                                                                                defaultValue={detail?.roleName}
                                                                                disabled={true}
                                                                            >
                                                                            </InlineInput>
                                                                            :
                                                                            <SelectBox
                                                                                options={props.businessRoles}
                                                                                optionLabel="name"
                                                                                optionValue="id"
                                                                                isDisabled={readOnly}
                                                                                onChange={(value) => {
                                                                                    setRoleId(value);
                                                                                    setErrRole(false);
                                                                                }}
                                                                                placeholder={t('createUser.placeholderRole')}
                                                                                value={roleId || null}
                                                                                error={errRole}
                                                                                errMess={t('createUser.reqMess')}
                                                                            >
                                                                            </SelectBox>}
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>

                                                    {isEdit ?
                                                        <div
                                                            className="position-absolute position-right text-center right">
                                                            <label>&nbsp;</label>
                                                            <More>
                                                                {allowsToUpdate ?
                                                                    <a className="dropdown-item edit"
                                                                       title={t('usersManagement.userDetail.buttonEditPrimaryRole')}
                                                                       onClick={() => {
                                                                           setShowModalRole(true);
                                                                       }}
                                                                    >
                                                                        <i className="fal fa-pen"/>
                                                                        {t('usersManagement.userDetail.buttonEditPrimaryRole')}
                                                                    </a>
                                                                    : <button className="dropdown-item edit"
                                                                              title={t('usersManagement.userDetail.buttonEditPrimaryRole')}
                                                                              disabled
                                                                    >
                                                                        <i className="fal fa-pen"/>{t('usersManagement.userDetail.buttonEditPrimaryRole')}
                                                                    </button>
                                                                }
                                                            </More>
                                                        </div> : null}
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            isEdit &&
                                            <div className="card card-section card-list mb-0 form-edit-header">
                                                <div className="card-header">
                                                    {
                                                        secondaryRoles.length > 0 ? <div
                                                            className="form-section d-flex align-items-center">
                                                            <h5 className="mb-0">{t('createUser.concurrently')}</h5>
                                                        </div> : null
                                                    }
                                                </div>
                                                <div className="card-body px-0 pt-1">
                                                    {
                                                        secondaryRoles.length > 0 && <div className="form-row pb-0">
                                                            <div className="col-3">
                                                                <div className="form-group form-group-sm">
                                                                    <label>{t('usersManagement.header.company')}</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3">
                                                                <div className="form-group form-group-sm">
                                                                    <label>{t('usersManagement.header.department')}</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="form-group form-group-sm">
                                                                    <label>{t('usersManagement.header.position')}</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="form-group form-group-sm">
                                                                    <label>{t('createUser.titleRole')}</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="form-group form-group-sm">
                                                                    <label>{t('usersManagement.header.roles')}</label>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="position-absolute position-right text-center"/>
                                                        </div>
                                                    }
                                                    {
                                                        secondaryRoles.map((item, index) => {
                                                            return <>
                                                                <div className="form-row p-0" key={index}>
                                                                    <div className="col-3">
                                                                        <div className="form-group form-group-sm">
                                                                            <article>
                                                                                <InlineInput
                                                                                    defaultValue={item.companyName}
                                                                                    placeholder={t('createUser.placeholderCompany')}
                                                                                    disabled={true}
                                                                                >
                                                                                </InlineInput>
                                                                            </article>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group form-group-sm">
                                                                            <article>
                                                                                <InlineInput
                                                                                    defaultValue={item.departmentName}
                                                                                    placeholder={t('createUser.placeholderDepartment')}
                                                                                    disabled={true}
                                                                                >
                                                                                </InlineInput>
                                                                            </article>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <div className="form-group form-group-sm">
                                                                            <article>
                                                                                <InlineInput
                                                                                    defaultValue={item.functionName}
                                                                                    placeholder={t('createUser.placeholderRole')}
                                                                                    disabled={true}
                                                                                >
                                                                                </InlineInput>
                                                                            </article>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <div className="form-group form-group-sm">
                                                                            <article>
                                                                                <InlineInput
                                                                                    defaultValue={item.positionName}
                                                                                    placeholder={t('createUser.titleRole')}
                                                                                    disabled={true}
                                                                                >
                                                                                </InlineInput>
                                                                            </article>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <div className="form-group form-group-sm">
                                                                            <article>
                                                                                <InlineInput
                                                                                    defaultValue={`${item.roleName}`}
                                                                                    placeholder={t('createUser.placeholderPosition')}
                                                                                    disabled={true}
                                                                                >
                                                                                </InlineInput>
                                                                            </article>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="position-absolute position-right text-center">
                                                                        {allowsToUpdate ?
                                                                            <More>
                                                                                <a className="dropdown-item edit"
                                                                                        title={t('usersManagement.userDetail.buttonEditSecondaryRole')}
                                                                                        onClick={() => {
                                                                                            setSecondaryRoleDetail(item)
                                                                                            setShowEditSecondaryModalRole(true)
                                                                                        }}
                                                                                >
                                                                                    <i className="fal fa-pen"/>{t('usersManagement.userDetail.buttonEditSecondaryRole')}
                                                                                </a>
                                                                                <a className="dropdown-item"
                                                                                        title={t('usersManagement.userDetail.buttonDeleteSecondaryRole')}
                                                                                        onClick={() => {
                                                                                            confirmation({
                                                                                                content: t('modal.deleteSecondaryRole.content'),
                                                                                                title: t('modal.deleteSecondaryRole.title'),
                                                                                                onConfirm: ({onClose}) => {
                                                                                                    removeSecondaryRole(item.id)
                                                                                                        .then(() => onClose())
                                                                                                        .catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}))
                                                                                                }
                                                                                            })
                                                                                        }}
                                                                                >
                                                                                    <i className="fal fa-minus-circle"/>{t('usersManagement.userDetail.buttonDeleteSecondaryRole')}
                                                                                </a>
                                                                            </More>
                                                                            : <More>
                                                                                <button className="dropdown-item"
                                                                                        title={t('usersManagement.userDetail.buttonEditSecondaryRole')}
                                                                                        disabled
                                                                                >
                                                                                    <i className="fal fa-pen"/>{t('usersManagement.userDetail.buttonEditSecondaryRole')}
                                                                                </button>
                                                                                <button className="dropdown-item"
                                                                                        title={t('usersManagement.userDetail.buttonDeleteSecondaryRole')}
                                                                                        disabled
                                                                                >
                                                                                    <i className="fal fa-minus-circle"/>{t('usersManagement.userDetail.buttonDeleteSecondaryRole')}
                                                                                </button>
                                                                            </More>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                {
                                                                    (item.startAffectedDate || item.note || item.isNoLimited) &&
                                                                    <div
                                                                        className='card ml-2 mb-1 pt-1 px-1 bg-light-primary rounded'
                                                                        title={statusToTitle(item)}>
                                                                        {
                                                                            <div className='form-group form-group-sm'>
                                                                                <label className="pr-25">Hiệu
                                                                                    lực:</label>
                                                                                {
                                                                                    item.isNoLimited ?
                                                                                        <div
                                                                                            className={`d-inline-block ${item.isAffected ? "text-success border-bottom-dashed" : ""}`}>Vô
                                                                                            thời hạn</div>
                                                                                        : <div
                                                                                            className={`d-inline-block ${item.isAffected ? "text-success border-bottom-dashed" : ""}`}>{filters.date(item.startAffectedDate)} - {filters.date(item.endAffectedDate)}</div>
                                                                                }
                                                                            </div>
                                                                        }
                                                                        {
                                                                            item.note &&
                                                                            <div className='form-group form-group-sm'>
                                                                                <label className="pr-25">Ghi
                                                                                    chú:</label>{item.note}
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                }
                                                            </>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </form>
                                </FormProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                (isEdit) && <>
                    {
                        <UserRoleModal
                            key={primaryModalRoleKey}
                            show={showModalRole}
                            title={t('modal.updatePrimaryRole.title')}
                            detail={detail}
                            listCompany={props.companies}
                            listFunction={listFunction}
                            listRoles={props.businessRoles}
                            listPositionRoles={props.positionRoles}
                            onClose={() => {
                                setShowModalRole(false);
                                setPrimaryModalRoleKey(primaryModalRoleKey + 1)
                            }}
                            onSave={updateUserRole}
                            roleConstraint={roleConstraint}
                        />
                    }
                    <ConcurrentlyModal
                        key={secondaryModalRoleKey}
                        title={t('modal.createSecondaryRole.title')}
                        show={showSecondaryModalRole}
                        listCompany={props.companies}
                        listFunction={listFunction}
                        listRoles={props.businessRoles}
                        listPositionRoles={props.positionRoles}
                        onClose={() => {
                            setShowSecondaryModalRole(false)
                            setSecondaryModalRoleKey(secondaryModalRoleKey + 1)
                        }}
                        onSave={createUserSecondaryRole}
                        roleConstraint={roleConstraint}
                    />
                    {
                        !isEmpty(secondaryRoleDetail) &&
                        <ConcurrentlyModal
                            // key={secondaryModalRoleKey}
                            title={t('modal.updateSecondaryRole.title')}
                            show={showEditSecondaryModalRole}
                            listCompany={props.companies}
                            listRoles={props.businessRoles}
                            listFunction={listFunction}
                            listPositionRoles={props.positionRoles}
                            detail={secondaryRoleDetail}
                            onClose={() => {
                                setShowEditSecondaryModalRole(false)
                                setSecondaryModalRoleKey(secondaryModalRoleKey + 1)
                            }}
                            onSave={updateUserSecondaryRole}
                            roleConstraint={roleConstraint}
                        />
                    }
                    <StatusSwitcher
                        show={showModalConfirm}
                        onClose={() => {
                            setShowModalConfirm(false);
                        }}
                        onConfirm={statusHandler}
                        reasonLabel={t('usersManagement.actionBlock.reason')}
                        targetLabel={t('usersManagement.title')}
                        blockLabel={t('usersManagement.actionBlock.lock')}
                        unBlockLabel={t('usersManagement.actionBlock.unlock')}
                        entity={selectedItem}
                    />
                </>
            }
        </div>
    )
}

UserForm.propTypes = {
    userId: PropTypes.string,
    readOnly: PropTypes.bool,
    companies: PropTypes.array,
    roles: PropTypes.array,
    businessRoles: PropTypes.array,
    positionRoles: PropTypes.array,
    detail: PropTypes.object,
};

UserForm.defaultProps = {
    readOnly: false,
    companies: [],
    roles: [],
    businessRoles: [],
    positionRoles: [],
};

export default UserForm;
