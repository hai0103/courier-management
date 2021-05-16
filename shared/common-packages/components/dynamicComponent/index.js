import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useDynamicComponentContext} from "providers/dynamicComponent";

const DynamicComponent = (props) => {
    const defaultComponent = import('components/maintenance');
    const {component, data} = useDynamicComponentContext();
    const [activeComponent, setActiveComponent] = useState(props.activeComponent);

    useEffect(() => {
        setActiveComponent(component)
    }, [component])

    const makeImportedComponent = () => {
        const componentKey = activeComponent || props.defaultComponent;
        if (props.importedComponent[componentKey]) {
            return props.importedComponent[componentKey];
        }

        return defaultComponent;
    }
    const importedComponent = makeImportedComponent();

    const Component = dynamic(
        () => importedComponent,
        {ssr: false}
    );

    return (
        <Component {...data} />
    )
}

DynamicComponent.propTypes = {
    importedComponent: PropTypes.object,
    activeComponent: PropTypes.string,
    defaultComponent: PropTypes.string
};

DynamicComponent.defaultProps = {

};

export default DynamicComponent;