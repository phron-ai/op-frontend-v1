import { ArrowUpward } from "@mui/icons-material";
import { useEffect, useState } from "react";

import "./index.scss";

const ToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return isVisible ? (
        <div
            className="to-top-button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <ArrowUpward />
        </div>
    ) : null;
};

export default ToTopButton;
