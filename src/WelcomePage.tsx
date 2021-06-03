/* eslint-disable import/no-webpack-loader-syntax */
import Content from "!babel-loader!@mdx-js/loader!./Content.mdx";
import { NavLight } from "./sidenav/NavLight";

export const HomePage = () => {
  return (
    <article className="main__wrapper">
      <h1 className="sm:text-lg sm:leading-snug font-semibold tracking-wide uppercase  mb-3">
        Matruski rad:
      </h1>
      <p className=" text-3xl sm:text-5xl lg:text-6xl leading-none font-extrabold text-gray-900 tracking-tight mb-8">
        Web tehnologije i <br /> mikrokontroleri
      </p>
      <p className="mt-2 ">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam
        repellat, excepturi possimus, voluptas iusto.
      </p>
      <div className="mt-80 grid grid-cols-2">
        <p className=" leading-none">
          Učenik:
          <br />
          <span className="font-semibold text-lg">Jovica Veljković</span>
        </p>
        <p className=" leading-none  ">
          Profesor:
          <br />
          <span className="font-semibold text-lg">Radica Aleksandrov </span>
        </p>
      </div>
      <div className="markdown-body">
        <Content />
      </div>
    </article>
  );
};
