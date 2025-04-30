import { Link } from "react-router-dom";

import logoIconSrc from "assets/logo-icon.png";
import logoSrc from "assets/logo.png";

export function Logo({ showOnlyHead = false }: { showOnlyHead?: boolean }) {
  return (
    <Link to="/">
      {showOnlyHead ? (
        <div className="w-[50px] h-[50px]">
          <img
            src={logoIconSrc}
            alt="logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>
      ) : (
        <div className="w-[100px] md:w-[150px]">
          <img
            src={logoSrc}
            alt="logo"
            width={150}
            height={40}
            className="object-contain"
          />
        </div>
      )}
    </Link>
  );
}
