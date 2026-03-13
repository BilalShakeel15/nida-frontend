import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Fix: clear any overflow lock that might be set by modals/drawers
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant" // instant so it doesn't feel laggy on route change
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;