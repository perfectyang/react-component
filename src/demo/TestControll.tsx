import React from "react";
import usePropsValue from "../components/List/hooks/usePropsValue";

type ISon = {
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
};

const Son: React.FC<ISon> = (props) => {
  const pros = Object.assign({}, props, {
    defaultValue: "defalut",
  });
  console.log("props", pros);
  const [value, setValue] = usePropsValue<string>(pros);
  console.log("value", value);
  return (
    <>
      <h1>{value}</h1>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <button
        onClick={() => {
          setValue("1");
        }}
      >
        render
      </button>
    </>
  );
};

interface IProps {}
const Index: React.FC<IProps> = ({}) => {
  const [value, setValue] = React.useState("chese");
  return (
    <>
      <h1>test Controlled----{value}</h1>
      {/*value={value} onChange={setValue}  */}
      <Son />
    </>
  );
};

export default Index;
