import React from "react";
import {useTranslation} from "react-i18next";

const localSearchBox = ({globalFilter, setGlobalFilter}) => {
    const [value, setValue] = React.useState(globalFilter);
    const {t} = useTranslation('common');
    const search = (e) => {
        e.preventDefault();
        setGlobalFilter(value || undefined);
    }

    return (
        <div className="position-relative has-icon-left">
            <form onSubmit={search}>
                <input name="keyword"
                    type="search"
                    value={value || ""}
                    onChange={e => {
                        setValue(e.target.value);
                    }}
                    className="form-control form-control-sm " placeholder={t('pagination.searchPlaceholder') + '...'} />
                <div className="form-control-position">
                    <i onClick={search} className="fal fa-search text-size-base la-rotate-270"/>
                </div>
            </form>
        </div>
    );
}

export default React.memo(localSearchBox);
