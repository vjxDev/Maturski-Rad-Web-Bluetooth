import { useContext } from "react";
import { Link } from "react-router-dom";
import { ValueContext } from "../BLE/BLEProvider";
// import gfm from "remark-gfm";

import ReactMarkdown from "react-markdown";

export const WelcomePage = () => {
  const { valueState } = useContext(ValueContext);

  let lev = "border-gray-600";
  let bat = 0;
  let textWhite = " ";
  if (valueState.battery?.batteryLevel) {
    lev =
      valueState.battery?.batteryLevel > 60
        ? "border-blue-600 bg-blue-600"
        : valueState.battery?.batteryLevel > 15
        ? "border-green-600 bg-green-600"
        : "border-red-600 bg-red-600";
    bat = valueState.battery.batteryLevel;
    textWhite = valueState.battery.batteryLevel > 60 ? "text-white" : " ";
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-auto sm:w-5/6 mx-auto   ">
        <ul className="grid grid-rows-3 grid-cols-1 sm:grid-cols-3 sm:grid-rows-1 gap-1 sm:gap-4">
          <li>
            <Link to="/battery">
              <div className="h-full  border rounded-md shadow-lg p-4 bg-gray-50 ">
                <h2 className="font-bold text-lg"> Battery</h2>
                <div className="mt-4 grid grid-cols-1 grid-rows-2 ">
                  <div className="relative mx-auto w-24 h-24 bg-gray-200 rounded-full">
                    <div
                      className={` absolute w-full h-full mx-auto  rounded-full border-8 `}
                    ></div>
                    <div
                      className={`absolute w-full h-full  rounded-full border-8 ${lev} `}
                      style={{
                        transition: "clip-path 600ms ease-in-out",
                        clipPath: `polygon(0% 100%, 0% ${100 - bat}%, 100% ${
                          100 - bat
                        }%, 100% 100%)`,
                      }}
                    ></div>
                    <div className="absolute w-full h-full  flex items-center justify-center">
                      <span className={`${textWhite} text-xl font-semibold`}>
                        {valueState.battery?.batteryLevel}
                      </span>
                    </div>
                  </div>

                  {/*  TEXT   */}
                  <div className="mt-4 mx-2 space-y-1">
                    <div className="flex">
                      Battery Level:
                      <span className=" ml-auto  text-xl font-semibold">
                        {valueState.battery?.batteryLevel}
                      </span>
                    </div>
                    <div className="flex">
                      Battery Status:
                      <span className=" ml-auto text-xl font-semibold">
                        {valueState.battery?.batteryLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/light">
              <div className="h-full relative border rounded-md shadow-lg  p-4 bg-gray-50 ">
                <h2 className="absolute font-bold text-lg"> Lights</h2>
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="h-24 w-24 " viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      style={{ color: `rgb()` }}
                      d="M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63Z"
                    />
                    <path
                      fill="currentColor"
                      d="M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M11,18H13V15.87C14.73,15.43 16,13.86 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12C8,13.86 9.27,15.43 11,15.87V18Z"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/heat">
              <div className="h-full  border rounded-md shadow-lg  p-4  bg-gray-50 ">
                <h2 className="font-bold text-lg"> Temperature Humidity</h2>
                <div className="mt-4 grid grid-cols-2 grid-rows-1">
                  <div className="flex flex-col-reverse items-center justify-center">
                    <span className="mt-2 text-center">Temperature</span>
                    <div
                      className={` w-16 h-16 flex items-center justify-center rounded-full border-4 ${lev}`}
                    >
                      <span className=" text-xl font-semibold">
                        {valueState.environmentalSensing?.temperature}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col-reverse items-center justify-center">
                    <span className="mt-2 text-center">Humidity</span>
                    <div
                      className={` w-16 h-16 flex items-center justify-center rounded-full border-4 ${lev}`}
                    >
                      <span className=" text-xl font-semibold">
                        {valueState.environmentalSensing?.humidity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const HomePage = () => {
  const markdown = `
# A demo of \`react-markdown\`

\`react-markdown\` is a markdown component for React.

👉 Changes are re-rendered as you type.

👈 Try writing some markdown on the left.

## Overview

* Follows [CommonMark](https://commonmark.org)

* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)

* Renders actual React elements instead of using \`dangerouslySetInnerHTML\`

* Lets you define your own components (to render \`MyHeading\` instead of \`h1\`)

* Has a lot of plugins

## Table of contents

Here is an example of a plugin in action

([\`remark-toc\`](https://github.com/remarkjs/remark-toc)).

This section is replaced by an actual table of contents.

## Syntax highlighting

Here is an example of a plugin to highlight code:

[\`rehype-highlight\`](https://github.com/rehypejs/rehype-highlight).

\`\`\`js

import React from 'react'

import ReactDOM from 'react-dom'

import Markdown from 'react-markdown'

import rehypeHighlight from 'rehype-highlight'

ReactDOM.render(
  <Markdown rehypePlugins={[rehypeHighlight]}>{'# Your markdown here'}</Markdown>,
  document.querySelector('#content')
)
\`\`\`

Pretty neat, eh?
## GitHub flavored markdown (GFM)
For GFM, you can *also* use a plugin:
[\`remark-gfm\`](https://github.com/remarkjs/react-markdown#use).
It adds support for GitHub-specific extensions to the language:
tables, strikethrough, tasklists, and literal URLs.
These features **do not work by default**.

👆 Use the toggle above to add the plugin.
| Feature    | Support              |
| ---------: | :------------------- |
| CommonMark | 100%                 |
| GFM        | 100% w/ \`remark-gfm\` |

~~strikethrough~~

* [ ] task list

* [x] checked item

https://example.com

## HTML in markdown

⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can

use [\`rehype-raw\`](https://github.com/rehypejs/rehype-raw).


You should probably combine it with

[\`rehype-sanitize\`](https://github.com/rehypejs/rehype-sanitize).

<blockquote>

👆 Use the toggle above to add the plugin.

</blockquote>

## Components

You can pass components to change things:

\`\`\`js
import React from 'react'

import ReactDOM from 'react-dom'


import Markdown from 'react-markdown'
import MyFancyRule from './components/my-fancy-rule.js'


ReactDOM.render(

  <Markdown

  components={{

    // Use h2s instead of h1s

    h1: 'h2',

    // Use a component instead of hrs

    hr: ({node, ...props}) => <MyFancyRule {...props} />

  }}

  >

  # Your markdown here

  </Markdown>,
  document.querySelector('#content')

  )


  \`\`\`

  ## More info?

  Much more info is available in the

  [readme on GitHub](https://github.com/remarkjs/react-markdown)!

  ***

A component by [Espen Hovlandsdal](https://espen.codes/)`;

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
        <ReactMarkdown children={markdown}></ReactMarkdown>
      </div>
    </article>
  );
};
