import { classes, mDiv } from "../lib/html";

export const Loader = ({ classNames, size = 50 } = {}) => {
  return mDiv(
    classes(`flex justify-center items-center ${classNames || ""}`),
    mDiv(classes("loader"))
  );
};
