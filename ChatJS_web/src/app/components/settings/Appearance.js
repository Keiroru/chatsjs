import style from "@/app/styles/account.module.css";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Appearance() {
    const { t } = useTranslation();
    return (
        <div className={style.accountContainer}>
            <h1 className={style.accountTitle}>{t("appearance")}</h1>
            <div>
                <p>{t("changeLanguage")}</p>
                <LanguageSwitcher />
            </div>
        </div>
    );
}

