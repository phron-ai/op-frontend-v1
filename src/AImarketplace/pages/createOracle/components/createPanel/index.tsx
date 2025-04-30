import { useState } from "react";

import useOracles from "AImarketplace/hooks/useOracles";
import useAuth from "smartcontract-builder/hooks/auth";
import { Textarea } from "components/ui/textarea";
import phronEyeSrc from "assets/phron-eye.png";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import "./index.scss";

const CreatePanel = () => {
  const { createOracle } = useOracles();
  const { isAuth, sign } = useAuth();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name || !description) {
      alert("something is empty.");
      return;
    }
    try {
      await createOracle({ name, description, price });
      setDescription("");
      setPrice("");
      setName("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white w-full shadow-md p-6 min-h-[430px] rounded-lg space-y-4 max-w-lg">
      <div className="grid place-content-center rounded-xl mx-auto w-14 h-14 bg-gradient-to-br from-[#8b8ede] to-[#e4adf0]">
        <img
          src={phronEyeSrc}
          alt="phronai logo"
          width={20}
          height={20}
          className="object-contain"
        />
      </div>
      <h1 className="text-center text-xl font-bold">New Oracle</h1>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={"Name:"}
        className="placeholder:text-black/20 "
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={"Description:"}
        className="placeholder:text-black/20 min-h-[100px]"
      />
      <Input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder={"Price:"}
        className="placeholder:text-black/20 "
      />
      {isAuth ? (
        <Button onClick={handleCreate} className="w-full ">
          Create
        </Button>
      ) : (
        <Button
          onClick={sign}
          className="w-full"
        >
          Please sign to use
        </Button>
      )}
    </div>
  );
};

export default CreatePanel;