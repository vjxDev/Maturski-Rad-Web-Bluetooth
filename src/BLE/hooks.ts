import { useContext } from "react";
import { ConnectAndDisconectContext, BLEContext } from "./BLEProvider";

export const useLogAll = () => {
  const { BLEstate } = useContext(BLEContext);
  function logAll() {
    console.log("device %o", BLEstate.ble.device);
    console.log("GATT Server %o", BLEstate.ble.server);
  }
  return logAll;
};

export const useStatus = () => {
  const { BLEstate } = useContext(BLEContext);
  const { device } = BLEstate.ble;
  const { isAvailable, isConnected, connecting, failed } = BLEstate.data;

  return { isAvailable, isConnected, connecting, failed, device } as const;
};

export const useConnect = () => {
  const { Connect } = useContext(ConnectAndDisconectContext);
  return [Connect] as const;
};

export const useDisconnect = () => {
  const { Disconnect } = useContext(ConnectAndDisconectContext);

  return [Disconnect] as const;
};
///
//     GetData
///
// export const useService = (serviceUUID: BluetoothServiceUUID) => {
//   const { BLEstate } = useContext(BLEContext);
//   const { serState, serDispatch } = useContext(ServicesContext);
//   const GATT = BLEstate.ble.server;

//   async function getService() {
//     if (serState.services?.find((l) => l.serviceUUID === serviceUUID)) return;
//     const s = await GATT?.getPrimaryService(serviceUUID);
//     serDispatch({
//       type: TyS.addSer,
//       payload: { serviceUUID: serviceUUID, service: s },
//     });
//   }
//   useEffect(() => {
//     getService();
//     // eslint-disable-next-line
//   }, [GATT]);

//   return serState.services?.find((l) => l.serviceUUID === serviceUUID);
// };

// export const useGetData = (
//   serviceUUID: BluetoothServiceUUID,
//   characteristicUUID: BluetoothCharacteristicUUID
// ) => {
//   const { BLEstate } = useContext(BLEContext);
//   const GATT = BLEstate.ble.server;
//   const [
//     // eslint-disable-next-line
//     characteristic,
//     setCharacteristic,
//   ] = useState<BluetoothRemoteGATTCharacteristic>();
//   const service = useService(serviceUUID);

//   const [value, setValue] = useState<DataView>();
//   async function getData() {
//     console.log("GetData  ");

//     try {
//       const c = await service?.service?.getCharacteristic(characteristicUUID);
//       console.log("Char %o", c);

//       setCharacteristic(c);

//       if (c?.properties.notify) {
//         console.log("Char ");
//         await c.startNotifications();
//         c?.addEventListener("characteristicvaluechanged", HandelValueChange);
//       } else {
//         c?.addEventListener("characteristicvaluechanged", HandelValueChange);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   function HandelValueChange(e: Event) {
//     const v = (e.target as BluetoothRemoteGATTCharacteristic).value;
//     console.log("HandelValueChange %o", v);

//     setValue(v);
//   }
//   useEffect(() => {
//     getData();

//     // eslint-disable-next-line
//   }, [GATT, service]);
//   useEffect(() => {
//     console.log(
//       "value %o, serviceUUID %o, characteristicUUID %o, service %o",
//       value,
//       serviceUUID,
//       characteristicUUID,
//       service
//     );
//   }, [value, serviceUUID, characteristicUUID, service]);

//   return [value, getData] as const;
// };
// export const useIsConnected = (): boolean => {
//   return useContext(BLEContext).state.isConnected;
// };
