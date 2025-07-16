import style from "./CommonSpinner.module.css"

export default function CommonSpinner({ message = "Loading..." }) {
    return (
        <div className={style.wrapper}>
            <div className={style.spinner}></div>
            <p className={style.text}>{message}</p>
        </div>
    );
}