/* eslint-disable import/no-webpack-loader-syntax */
import Content from "!babel-loader!@mdx-js/loader!./Content.mdx";

export const HomePage = () => {
  return (
    <article className="main__wrapper">
      <div className="markdown-body mt-2">
        <Content />
      </div>
    </article>
  );
};
