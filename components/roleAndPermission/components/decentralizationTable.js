import React from "react";
import ICheckbox from "sharedComponents/iCheckbox";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import {Response, Utility} from "utils/common";
import {useToasts} from "react-toast-notifications";

function DecentralizationTable(props) {
  const {t} = useTranslation('common');
  const {addToast} = useToasts();
  // const handleDisabled = (permission, role) => {
  //   if (props.isDisabled) {
  //     return true
  //   }
  //   if (props.handleDisabled) {
  //     return props.handleDisabled(permission, role)
  //   }
  //
  //   return false
  // }

  const handleChecked = (permission, role) => {
    if (props.handleChecked) {
      return props.handleChecked(permission, role)
    }
    const activeRoles = permission.roles || []
    const activeRole = activeRoles.find(item => {
      return item.id === role.id && item.value === true
    })

    return !!activeRole
  }

  const onAssign = async (permission, role, status) => {
    if (props.onAssign) {
      const payload =
        {
          userTypeId: role.id,
          permissionId: permission.id,
          status: status ? 1 : 0
        }
      try {
        const response = await props.onAssign(payload)
        if (Response.isSuccess(response)) {
          addToast(t('common.message.editSuccess'), {appearance: 'success'})
        } else {
          addToast(
            <div className='justify-content-center align-content-center text-center'>
              {Response.getAPIError(response)}
            </div>
            , {appearance: 'error'})
        }

      } catch (error) {
        addToast(Response.getErrorMessage(error), {appearance: 'error'})
      }
    }
  }

  return (
    <div className="table-content table-content-main">
      <table role="table" className="table table-justify table-group table-hover table-bordered">
        <thead>
        <tr role="row">
          <th className="align-middle bg-white" rowSpan="2">{props.title}</th>
          <th className="text-center bg-white" colSpan={props.roles.length}>
            {props.roleTitle}
          </th>
        </tr>
        <tr>
          {
            props.roles.map((item, index) => {
              return <th className="text-center bg-white"
                         key={index}>{item.name}{item.code ? " - " + item.code : ""}</th>
            })
          }
        </tr>
        </thead>
        <tbody>
        {
          props?.permissions?.map((permission, pIndex) => {
            return <tr key={pIndex}>
              <th className="pl-3 font-weight-normal bg-white">{permission.name}</th>
              {
                props.roles.map((role, rIndex) => {
                  const isCheck = handleChecked(permission, role)
                  return (
                    Utility.isBrowser() && <td className="text-center" key={rIndex}>
                      <ICheckbox
                        // disabled={handleDisabled(permission, role)}
                        onChange={(value) => onAssign(permission, role, value.target.checked)}
                        defaultChecked={isCheck}
                      />
                    </td>
                  )
                })
              }
            </tr>
          })
        }
        </tbody>
      </table>
    </div>

  )
}

DecentralizationTable.propTypes = {
  title: PropTypes.string,
  roleTitle: PropTypes.string,
  roles: PropTypes.array,
  permissions: PropTypes.array,
  handleDisabled: PropTypes.func,
  handleChecked: PropTypes.func,
  onAssign: PropTypes.func,
  isDisabled: PropTypes.bool
}

DecentralizationTable.defaultProps = {
  title: 'Untitled',
  roleTitle: 'Chức danh',
  roles: [],
  permissions: [],
  isDisabled: false
}

export default DecentralizationTable;
