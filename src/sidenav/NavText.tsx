import { FC } from "react";

export const NavTitle: FC = ({ children }) => {
  return <h1 className="aside__text-title">{children}</h1>;
};

export const NavSubTitle: FC = ({ children }) => {
  return <h2 className="aside__text-subtitile">{children}</h2>;
};

export const NavTextSmall: FC = ({ children }) => {
  return <h3 className="aside__text-small">{children}</h3>;
};
