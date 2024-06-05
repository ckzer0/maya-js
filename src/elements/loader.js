import { children, classes, mDiv } from "../lib/html";

// const Component = (comp) => {
//   const signalledProps = {};
//   // Object.entries(props).forEach(([key, value]) => {
//   //   if()
//   // });

//   return (props) => {
//     return comp(props);
//   };
// };

export const Loader = ({ classNames, size = 50 } = {}) => {
  return mDiv(
    classes(`flex justify-center items-center ${classNames || ""}`),
    children(mDiv(classes("loader")))
  );
};
