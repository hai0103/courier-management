import React, {useEffect, useState} from "react";
import ContentWrapper from "layouts/contentWrapper";
import {useTranslation} from "react-i18next";
import {DataTableProvider} from "providers/dataTable";
import Tab from "sharedComponents/tab";
import OrderList from "./orderList";
import {isNil} from "lodash";
import {ProcessStatusApi} from "services/processStatus";
import PropTypes from "prop-types";
import MainTab from "sharedComponents/mainTab";
import Link from "next/link";
import {ROUTES} from "../../../constants/common";
import {getUserProfile} from "utils/localStorage";

const OrderListContainer = (props) => {
  const [t] = useTranslation("common");
  const [count, setCount] = useState({});
  const [loggedUser, setLoggedUser] = useState({});
  const [processStatus, setProcessStatus] = useState(props.processStatus || [])
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    const _loggedUser = getUserProfile();
    setLoggedUser(_loggedUser)

  }, []);

  const makeTabContent = () => {
    const tabContent = [];
    props.processStatus.forEach(item => {
      const tabItem = async () => {
        const titleTab = item.name;

        return <OrderList
                {...props}
                processStatus={item.id || 0}
                userId={loggedUser?.id}
                isStaff={false}
                listStatus={props.processStatus}
              />
      }
      tabContent.push(tabItem);
    })

    return tabContent;
  }

  let tabContent = [
    {
      name:
        t("taskList.personal") +
        ` (${
          !isNil(count.totalTaskPersonal) ? count.totalTaskPersonal : 0
        })`,
      menu: "tab-allList",
      href: "tab-all-list",
      child: (
        <DataTableProvider>
          <OrderList
            {...props}
            typeOfTask={1}
            setCount={(obj) => setCount(obj)}
          />
        </DataTableProvider>
      ),
    },
    {
      name:
        t("taskList.general") +
        ` (${!isNil(count.totalTaskCommon) ? count.totalTaskCommon : 0})`,
      menu: "tab-remindList",
      href: "tab-remind-list",
      child: (
        <DataTableProvider>
          <OrderList
            {...props}
            typeOfTask={2}
            setCount={(obj) => setCount(obj)}
          />
        </DataTableProvider>
      ),
    },
  ]

  return (
    <ContentWrapper>
      {/*{*/}
      {/*  <Tab*/}
      {/*    classLevelTab="nav-tabs nav-level-3 nav-underline nav-underline-o no-hover-bg"*/}
      {/*    content={makeTabContent()}*/}
      {/*  />*/}
      {/*}*/}
      <MainTab
        menuNameKey="name"
        classLevelTab="nav-tabs nav-level-3 nav-underline nav-underline-o no-hover-bg"
        menu={props.processStatus}
        content={makeTabContent()}
        // rightControl={
        //   () => (
        //     <Link href={ROUTES.NEW_ORDER}>
        //       <button className="btn btn-primary btn-md"
        //       >
        //         {t('usersManagement.userDetail.addNew')}
        //       </button>
        //     </Link>
        //   )
        // }
      />
    </ContentWrapper>
  );
};

OrderListContainer.propTypes = {
  processStatus: PropTypes.array,
};

OrderListContainer.defaultProps = {
  processStatus: [],
};

export default OrderListContainer;
