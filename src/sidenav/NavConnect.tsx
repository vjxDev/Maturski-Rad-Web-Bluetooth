import { useConnect, useDisconnect, useStatus } from "../BLE/hooks";

export const NavConnect = () => {
  const [Connect] = useConnect();
  const [Disconnect] = useDisconnect();
  const { connected } = useStatus();
  return (
    <div className="h-8 sm:h-24 text-center ">
      {connected ? (
        <button
          className="w-full h-full border-t rounded-t-2xl sm:border-none sm:rounded-none bg-gray-50 hover:bg-gray-200"
          onClick={Disconnect}
        >
          Disconnect
        </button>
      ) : (
        <button
          className="w-full h-full border-t rounded-t-2xl sm:border-none sm:rounded-none bg-gray-50 hover:bg-gray-200"
          onClick={Connect}
        >
          Connect
        </button>
      )}
    </div>
  );
};
