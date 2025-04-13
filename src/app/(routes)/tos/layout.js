import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function TermsOfServiceLayout({ children }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
} 