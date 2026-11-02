
import styles from "./Header.module.css";
export const Header = () => {
console.log("HEADER CSS MODULE:", styles);
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <a href="#" className={styles.logo}>
                    Чистая вода<span className={styles.logoAccent}>.</span>
                </a>

                <a href="#contacts" className={styles.contactLink}>
                    Связаться с мастером
                </a>
            </div>
        </header>
    );
};
