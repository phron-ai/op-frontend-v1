import "./index.scss"

const TextField = ({ value, onChange, label, type, tagType }: any) => {
    const renderField = () => {
        switch (tagType) {
            case "textarea":
                return (
                    <textarea
                        value={value}
                        onChange={onChange}
                        placeholder={label}
                    />
                );

            case "input":
                return (
                    <input
                        value={value}
                        onChange={onChange}
                        type={type}
                        placeholder={label}
                    />
                );

            case "button":
                return (
                    <button onClick={() => onChange}>{value}</button>
                );

            default:
                return null;
        }
    };

    return (
        <div className="oracle-text-field">
            {renderField()}
        </div>
    );
};

export default TextField;