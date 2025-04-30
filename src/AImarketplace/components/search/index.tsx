import { useState } from "react";

import { Input } from "components/ui/input";
import "./index.scss";

const SearchPan = () => {
  const [searchInput, setSearchInput] = useState<string>("");

  return (
    <div className="max-w-[250px]">
      <Input
        type="text"
        placeholder="ETH, Fantom, ..."
        className="bg-white px-5 py-5"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        aria-label="Search cryptocurrencies"
      />
    </div>
  );
};

export default SearchPan;