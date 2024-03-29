import { useConnect, useDisconnect, useStatus } from "../BLE/hooks";

import { NavBattery } from "./NavBattery";
import { NavHeat } from "./NavHeat";
import { NavLight } from "./NavLight";

export const SideNav = () => {
  const [Connect] = useConnect();
  const [Disconnect] = useDisconnect();

  const { failed, isConnected } = useStatus();

  // const { failed, device } = useStatus();
  // const isConnected = true;

  return (
    <>
      <div className="aside__top-nav">
        <button
          className={`aside__open-button ${
            isConnected
              ? " aside__open-button-connected "
              : " aside__open-button-disconnected "
          }`}
        >
          <svg className="svg-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M14.88,16.29L13,18.17V14.41M13,5.83L14.88,7.71L13,9.58M17.71,7.71L12,2H11V9.58L6.41,5L5,6.41L10.59,12L5,17.58L6.41,19L11,14.41V22H12L17.71,16.29L13.41,12L17.71,7.71Z"
            />
          </svg>
        </button>
        <button className="aside__close-button" tabIndex={-1} disabled>
          <svg className="svg-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
        </button>
      </div>
      <div tabIndex={0} className="aside__wrapper">
        <div className=" aside__buttons ">
          {!isConnected ? (
            <>
              <button className="" onClick={Connect}>
                <svg className="svg-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 7.5C12.69 7.5 13.27 7.73 13.76 8.2S14.5 9.27 14.5 10C14.5 11.05 14 11.81 13 12.28V21H11V12.28C10 11.81 9.5 11.05 9.5 10C9.5 9.27 9.76 8.67 10.24 8.2S11.31 7.5 12 7.5M16.69 5.3C17.94 6.55 18.61 8.11 18.7 10C18.7 11.8 18.03 13.38 16.69 14.72L15.5 13.5C16.5 12.59 17 11.42 17 10C17 8.67 16.5 7.5 15.5 6.5L16.69 5.3M6.09 4.08C4.5 5.67 3.7 7.64 3.7 10S4.5 14.3 6.09 15.89L4.92 17.11C3 15.08 2 12.7 2 10C2 7.3 3 4.94 4.92 2.91L6.09 4.08M19.08 2.91C21 4.94 22 7.3 22 10C22 12.8 21 15.17 19.08 17.11L17.91 15.89C19.5 14.3 20.3 12.33 20.3 10S19.5 5.67 17.91 4.08L19.08 2.91M7.31 5.3L8.5 6.5C7.5 7.42 7 8.58 7 10C7 11.33 7.5 12.5 8.5 13.5L7.31 14.72C5.97 13.38 5.3 11.8 5.3 10C5.3 8.2 5.97 6.64 7.31 5.3Z"
                  />
                </svg>
                Connect
              </button>
              {failed && (
                <p className="aside__button--info ">Faild to connect</p>
              )}
            </>
          ) : (
            <>
              <button className="" onClick={Disconnect}>
                Disconnect
              </button>
            </>
          )}
        </div>
        {isConnected && (
          <div className=" aside__info ">
            <NavHeat />
            <NavLight />
            <NavBattery />
          </div>
        )}
      </div>
    </>
  );
};
