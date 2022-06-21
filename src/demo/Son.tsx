import React from "react";
import Button from "../components/Button";
import Dialog from "../components/Dialog/index";
import TreeSelect from "../components/TreeSelect/index";
import Input from "../components/Input";
import Switch from "../components/Switch/index";
import TestSwitch from "../components/TestSwitch";
import Toast from "../components/Toast";
import Block from "./Block/Block";
import DemoInfiniteScroll from "../demo/DemoInfiniteScroll";
const options = [
  {
    label: "分类A",
    value: "A",
    children: [
      {
        label: "分类A-1",
        value: "A1",
        children: [
          {
            label: "分类A-1-1",
            value: "A11",
          },
          {
            label: "分类A-1-2",
            value: "A12",
          },
        ],
      },
      {
        label: "分类A-2",
        value: "A2",
        children: [
          {
            label: "分类A-2-1",
            value: "A21",
          },
          {
            label: "分类A-2-2",
            value: "A22",
          },
        ],
      },
    ],
  },
  {
    label: "分类B",
    value: "B",
    children: [
      {
        label: "分类B-1",
        value: "B1",
        children: [
          {
            label: "分类B-1-1",
            value: "B11",
          },
          {
            label: "分类B-1-2",
            value: "B12",
          },
        ],
      },
      {
        label: "分类B-2",
        value: "B2",
        children: [
          {
            label: "分类B-2-1",
            value: "B21",
          },
          {
            label: "分类B-2-2",
            value: "B22",
          },
        ],
      },
    ],
  },
  {
    label: "分类C",
    value: "C",
    children: [
      {
        label: "分类C-1",
        value: "C1",
        children: [
          {
            label: "分类C-1-1",
            value: "C11",
          },
          {
            label: "分类C-1-2",
            value: "C12",
          },
        ],
      },
      {
        label: "分类C-2",
        value: "C2",
        children: [
          {
            label: "分类C-2-1",
            value: "C21",
          },
          {
            label: "分类C-2-2",
            value: "C22",
          },
        ],
      },
    ],
  },
  {
    label: "分类D",
    value: "D",
    children: [
      {
        label: "分类D-1",
        value: "D1",
        children: [
          {
            label: "分类D-1-1",
            value: "D11",
          },
          {
            label: "分类D-1-2",
            value: "D12",
          },
        ],
      },
      {
        label: "分类D-2",
        value: "D2",
        children: [
          {
            label: "分类D-2-1",
            value: "D21",
          },
          {
            label: "分类D-2-2",
            value: "D22",
          },
        ],
      },
    ],
  },
];
interface IProps {
  value?: string;
}
const Son: React.FC<IProps> = (props) => {
  // const [value, setValue] = React.useState(props.value ?? "");
  // const myRef = React.useRef<HTMLInputElement>(null);
  // const show = () => {
  //   console.log();
  //   myRef.current?.focus();
  //   Toast({
  //     content: "在这里",
  //   });
  // };
  // const show2 = () => {
  //   Toast({
  //     content: "在这里2",
  //   });
  // };

  // const openLoad = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  // };
  // const [loading, setLoading] = React.useState(false);

  // const [checked, setChecked] = React.useState(false);

  // const [n, setn] = React.useState(0);

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setn((n) => n + 1);
  //   }, 500);
  // }, []);

  return (
    <>
      {/* <Block>
        <Button size="mini" color="warning" onClick={show2}>Toast2</Button>
      </Block>
      <Block>
        <Button block size="middle" color="primary" onClick={show}>Toast</Button>
      </Block>
      <Block>
        <Button size="large" color="success" onClick={show2}>Toast2</Button>
      </Block>
      <Block>
        <Input placeholder='请输入内容' type='password' value={value} onChange={(v) => {
          setValue(v)
        }} 
        clearable 
        />
      </Block>
      <Block>
        <Button color="danger" onClick={() => {
          Dialog.show({
            onClose: () => {
              console.log('close')
            }
          })
        }}>dialog</Button>
      </Block>

      <Block>
        <Switch checkedText="中文中言语主" uncheckedText="不可以不可以" loading={loading} checked={checked} onChange={(val) => {
          setLoading(true)
          setTimeout(() => {
            setLoading(false)
            setChecked(val)
          }, 2000)
        }} />
      </Block>
      <Block>
        <TestSwitch checked={checked} onChange={(val) => {
          setChecked(val)
        }} />
      </Block> */}
      {/* {n}
      <button onClick={() => {
        setn(n => n + 1)
      }}>addN</button>
      <DemoInfiniteScroll fn={() => {
        console.log('aa')
        setn(n => n+1)
        setTimeout(() => {
          setn(n => n+1)
        }, 600)
      }} /> */}
      <TreeSelect values={[]} options={options} />
    </>
  );
};

export default Son;
