import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

const ConstructorInputs = ({ constructorInfo, onInputChange }) => {
  return (
    <div className="constructor-inputs">
      {constructorInfo.map((item: any, index: number) => (
        <div className="each-input" key={index}>
          <Label className="pb-2 text-lg">{item.name}</Label>
          <Input
            className="p-4 bg-white"
            key={index}
            placeholder={`input ${item.type} info`}
            onChange={(e) => onInputChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default ConstructorInputs;