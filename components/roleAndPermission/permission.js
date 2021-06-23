import React, { useEffect, useState } from "react";
import DecentralizationTable from "./components/decentralizationTable";
import PropTypes from "prop-types";
import { ROLES } from "constants/common";
import { DecentralizationApi } from "services/decentralization";
import { useTranslation } from "react-i18next";
import { useToasts } from "react-toast-notifications";
import {PermissionApi} from "services/permission";

function PermissionManagement(props) {
  const {t} = useTranslation('common');
  const {addToast} = useToasts();

  const onAssign = (payload) => {
    console.log("permission, role>>>>", payload)
    return PermissionApi.assignSystemPermission(payload)
  }

  return (
    <>
      <div className="animated slideInRight">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-form card-no-border mb-0 shadow-none max-height">
              <div className="card-header card-header-main bg-light-primary">
                <div className="heading-elements">
                  <ul className="list-inline">
                    <li className="pl-1">
                      {/*<label onClick={() => setShowHistory(true)} id="menu-toggle-sm"*/}
                      {/*       className="opacity-normal">*/}
                      {/*  <a title={t('history.editingHistoryTitle')}*/}
                      {/*     className={'avatar btn-avatar' + (showHistory ? ' active' : '')}>*/}
                      {/*    <i className="fal fa-history"/>*/}
                      {/*  </a>*/}
                      {/*</label>*/}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="slide-content + (showHistory ? ' open' : '')">
                <DecentralizationTable
                  title="Phân quyền"
                  roleTitle="Loại người dùng - Vai trò"
                  roles={props.roles}
                  permissions={props.permissions}
                  onAssign={onAssign}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

PermissionManagement.propTypes = {
  roles: PropTypes.array,
  permissions: PropTypes.object
}

PermissionManagement.defaultProps = {
  roles: [],
  permissions: {}
}

export default PermissionManagement;
