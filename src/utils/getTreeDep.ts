export function getTreeDeep<T>(tree: T[]) {
  const walker = (node) => {
    let deep = 0;
    node.forEach((tree) => {
      if (tree.children) {
        deep = Math.max(deep, walker(tree.children) + 1);
      } else {
        deep = Math.max(deep, 1);
        tree.isLastLeft = true;
      }
    });
    return deep;
  };
  return walker(tree);
}
