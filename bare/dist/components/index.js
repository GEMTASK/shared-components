import { jsx as _jsx } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';
const useStyles = createUseStyles({
    View: {
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        background: OpenColor.red[9],
    },
    horizontal: {
        flexDirection: 'row',
    },
    flex: {
        flex: 1,
    },
});
const Button = () => {
    const styles = useStyles();
    return (_jsx("div", { className: styles.View, children: "Bare" }));
};
export { Button };
