import React from "react";
import { getTreeDeep } from "../../utils/getTreeDep";
import "./index.less";

interface ITree {
  label: string;
  value: string;
  children?: ITree[];
}

interface IProps {
  options: ITree[];
  values: string[];
}

const Index: React.FC<IProps> = ({ options, values }) => {
  const [selectValues, setSelectValues] = React.useState(values);

  const [deep, optionsParentMap, optionsMap] = React.useMemo(() => {
    const deep = getTreeDeep<ITree>(options);
    const optionsParentMap = new Map<string, ITree>();
    const optionsMap = new Map<string, ITree>();
    function traverse(options, current) {
      options.forEach((option) => {
        optionsParentMap.set(option.value, current);
        optionsMap.set(option.value, option);
        if (option.children) {
          traverse(option.children, option);
        }
      });
    }
    traverse(options, undefined);
    return [deep, optionsParentMap, optionsMap];
  }, [options]);

  const selectItem = (node) => {
    const parent: ITree[] = [];
    let current = node;
    while (current) {
      parent.push(current);
      const next = optionsParentMap.get(current.value);
      current = next;
    }
    const values = parent.reverse().map((i) => i.value);
    setSelectValues(values);
  };

  const renderItems = (options, i) => {
    return options?.map((option, idx) => {
      const isActive = option.value === selectValues[i];
      return (
        <div
          key={idx}
          className={isActive ? "active" : ""}
          onClick={() => !isActive && selectItem(option)}
        >
          {option.label}
        </div>
      );
    });
  };

  const renderColumn = () => {
    const columns = [];
    for (let i = 0; i < deep; i++) {
      const tpl = (
        <div className="column" key={i}>
          {renderItems(
            i == 0 ? options : optionsMap.get(selectValues[i - 1])?.children,
            i
          )}
        </div>
      );
      columns.push(tpl);
    }
    return columns;
  };

  return <div className="tree-column">{renderColumn()}</div>;
};

export default Index;
