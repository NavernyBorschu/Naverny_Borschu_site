import typography from "../../styles/typography.module.css";
import layout from "../../styles/layout.module.css";


export const AppGuide = () => {
    return (
        <div className={layout.wrapper}>
            <h1 className={typography.mobileTitle}>Гайд по додатку</h1>
        </div>
    );
}