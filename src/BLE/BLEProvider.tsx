import {
  createContext,
  Dispatch,
  FC,
  useEffect,
  useReducer,
  useState,
} from "react";
//////////
//  Bluetooth
//  - Availability?
//
////////
//  Device / GATT
//    { device, server }
//  - Connected?   /
//  - Connecting?  /
//  - Connect()     -> OnConnect
//  - Disconnect()  -> HandelDisconnect
//
///////
//  Services and characteristics
//  {Services[], characteristics[]}
//  OnConnect                 HandelDisconnect
//  - getPrimaryServices[]   ->  setToNull
//  - getCharacteristics[]   ->  setToNull
//  - startNotifications         removeEventListener
//      - HandelValueChange  ->  removeEventListener
//   { values of all characteristics }
//////////
export type RGB = {
  red: number;
  green: number;
  blue: number;
};

export type valueStateType = {
  Lights?: RGB;
  battery?: {
    batteryLevel?: number;
    batteryCharging?: boolean;
    BatteryDischarging?: boolean;
  };
  environmentalSensing?: {
    temperature?: number;
    humidity?: number;
  };
};
export enum TyValue {
  batteryCharging = "BatteryCharging",
  batteryDischarging = "BatteryDischarging",
  batteryLevel = "BatteryLevel",
  Lights = "Lights",
  temperature = "Temperature",
  humidity = "Humidity",
}

export type ValueActions =
  | { type: TyValue.batteryCharging; paload: boolean }
  | { type: TyValue.batteryDischarging; paload: boolean }
  | { type: TyValue.batteryLevel; paload: number }
  | { type: TyValue.Lights; paload: RGB }
  | { type: TyValue.humidity; paload: number }
  | { type: TyValue.temperature; paload: number };

const valueReducer = (state: valueStateType, action: ValueActions) => {
  switch (action.type) {
    case TyValue.batteryCharging:
      return {
        ...state,
        battery: { ...state.battery, batteryCharging: action.paload },
      };
    case TyValue.batteryDischarging:
      return {
        ...state,
        battery: { ...state.battery, BatteryDischarging: action.paload },
      };

    case TyValue.batteryLevel:
      return {
        ...state,
        battery: { ...state.battery, batteryLevel: action.paload },
      };
    case TyValue.Lights:
      return { ...state, heartRate: action.paload };
    case TyValue.humidity:
      return {
        ...state,
        environmentalSensing: {
          ...state.environmentalSensing,
          humidity: action.paload,
        },
      };
    case TyValue.temperature:
      return {
        ...state,
        environmentalSensing: {
          ...state.environmentalSensing,
          temperature: action.paload,
        },
      };
    default:
      return state;
  }
};
export const ValueContext = createContext<{
  valueState: valueStateType;
  valueDispatch: Dispatch<ValueActions>;
}>({ valueState: {}, valueDispatch: () => null });

type ble = {
  device?: BluetoothDevice;
  server?: BluetoothRemoteGATTServer;
  services?: BluetoothRemoteGATTService[];
};
type BleState = {
  data: {
    isAvailable?: boolean;
    isConnected?: boolean;
    connecting?: boolean;
    failed?: boolean;
  };
  ble: ble;
};
export enum Ty {
  AvailabilityChanged = "AvailabilityChanged",
  Connecting = "Connecting",
  Connected = "Connected",
  Disconnect = "Disconnect",
  FailedToConnect = "FailedToConnect",
}

export type ConnectionActions =
  | {
      type: Ty.AvailabilityChanged;
      payload: boolean;
    }
  | { type: Ty.Connecting }
  | { type: Ty.Connected; payload: ble }
  | { type: Ty.Disconnect }
  | { type: Ty.FailedToConnect };

const bleReducer = (state: BleState, action: ConnectionActions): BleState => {
  switch (action.type) {
    case Ty.AvailabilityChanged:
      return { ...state, data: { isAvailable: action.payload } };
    case Ty.Connecting:
      return {
        ...state,
        data: { ...state.data, connecting: true, failed: false },
      };
    case Ty.FailedToConnect:
      return {
        ...state,
        data: { ...state.data, connecting: false, failed: true },
      };
    case Ty.Connected:
      return {
        ...state,
        ble: action.payload,
        data: {
          ...state.data,
          isConnected: true,
          connecting: false,
          failed: false,
        },
      };
    case Ty.Disconnect:
      return {
        data: { ...state.data, isConnected: false, failed: false },
        ble: {},
      };
    default:
      return state;
  }
};

export const BLEContext = createContext<{
  BLEstate: BleState;
  BLEdispatch: Dispatch<ConnectionActions>;
}>({
  BLEstate: { data: {}, ble: {} },
  BLEdispatch: () => null,
});

export const ConnectAndDisconectContext = createContext<{
  Connect: () => any;
  Disconnect: () => any;
}>({ Connect: () => null, Disconnect: () => null });

export const LightCharContext = createContext<{
  lightChar?: BluetoothRemoteGATTCharacteristic;
}>({});

function parseRGB(value: DataView): RGB {
  return { red: 21, blue: 10, green: 14 };
}
function numberToRGB(color: RGB = { blue: 10, green: 10, red: 10 }) {}
interface ServicesAndCharacteristics {
  services: BluetoothRemoteGATTService[];
  characteristics: BluetoothRemoteGATTCharacteristic[];
}
export const BLEProvider: FC = ({ children }) => {
  let blue = navigator.bluetooth ? true : false;
  const [BLEstate, BLEdispatch] = useReducer(bleReducer, { data: {}, ble: {} });
  const { isConnected, connecting, isAvailable } = BLEstate.data;

  const [valueState, valueDispatch] = useReducer(valueReducer, {});
  const [sersAndChars, setSersAndChars] = useState<ServicesAndCharacteristics>({
    services: [],
    characteristics: [],
  });
  const [
    lightChar,
    setLightChar,
  ] = useState<BluetoothRemoteGATTCharacteristic>();

  // const allServices: servicesType[] = [
  //   {
  //     serviceUUID: "battery_service",
  //     characteristicUUID: ["battery_level", "battery_level_state"],
  //   },
  //   {
  //     serviceUUID: "heart_rate",
  //     characteristicUUID: ["heart_rate_measurement"],
  //   },
  //   {
  //     serviceUUID: "environmental_sensing",
  //     characteristicUUID: ["temperature", "humidity"],
  //   },
  //   {
  //     serviceUUID: "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
  //     characteristicUUID: [ "beb5483e-36e1-4688-b7f5-ea07361b26a8"],
  //   },
  //
  // ];

  // Availability
  function handleAvailabilityChanged(e: any) {
    BLEdispatch({ type: Ty.AvailabilityChanged, payload: e.target });
  }
  useEffect(() => {
    navigator.bluetooth?.getAvailability().then((x) => {
      BLEdispatch({ type: Ty.AvailabilityChanged, payload: x });
      console.log(`One time av ${x}`);
    });
    navigator.bluetooth?.addEventListener(
      "availabilitychanged",
      handleAvailabilityChanged
    );
    return () => {
      navigator.bluetooth?.removeEventListener(
        "availabilitychanged",
        handleAvailabilityChanged
      );
    };
  }, []);

  // Connect Function
  async function Connect() {
    if (!isAvailable || isConnected || connecting) return;

    let device: BluetoothDevice;
    let server: BluetoothRemoteGATTServer;
    try {
      BLEdispatch({ type: Ty.Connecting });
      device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "battery_service",
          "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
          "environmental_sensing",
        ],
      });
      device.addEventListener("gattserverdisconnected", HandelDisconnect);
      if (!device.gatt) {
        BLEdispatch({ type: Ty.Disconnect });
        return;
      }
      server = await device.gatt.connect();
      BLEdispatch({ type: Ty.Connected, payload: { server, device } });
    } catch {
      BLEdispatch({ type: Ty.FailedToConnect });
      return;
    }

    try {
      let services = await server.getPrimaryServices();
      setSersAndChars((prevState) => ({ ...prevState, services }));
      let characteristics: BluetoothRemoteGATTCharacteristic[];
      services.forEach(async (service) => {
        characteristics = await service.getCharacteristics();
        setSersAndChars((prevState) => ({
          ...prevState,
          characteristics: [...prevState.characteristics, ...characteristics],
        }));

        console.log(characteristics);

        characteristics.forEach(async (c) => {
          if (c.uuid === "beb5483e-36e1-4688-b7f5-ea07361b26a8") {
            setLightChar(c);
          }
          if (c.properties.notify) {
            await c.startNotifications();
            c.addEventListener("characteristicvaluechanged", HandelValueChange);
          } else {
            c.addEventListener("characteristicvaluechanged", HandelValueChange);
          }
        });
      });
    } catch {}
    console.log(valueState);
  }
  function HandelValueChange(e: Event) {
    const char = e.target as BluetoothRemoteGATTCharacteristic;
    if (char.value) {
      const value = char.value;

      switch (char.uuid) {
        //Temperature
        case "00002a6e-0000-1000-8000-00805f9b34fb":
          const a = value.getUint8(0) + value.getUint8(1) * 256;
          // console.log("Temp: %o", value);
          valueDispatch({ type: TyValue.temperature, paload: a / 100 });
          break;
        //Humidity
        case "00002a6f-0000-1000-8000-00805f9b34fb":
          const hum = value.getUint8(0) + value.getUint8(1) * 256;
          // console.log("Hum: %o", value);
          valueDispatch({ type: TyValue.humidity, paload: hum / 100 });
          break;

        // Battery Level
        case "00002a19-0000-1000-8000-00805f9b34fb":
          const batteryLevel = value.getUint8(0) + value.getUint8(1) * 256;
          // console.log(`Battery: ${batteryLevel} %o`, value);
          console.log(batteryLevel);
          valueDispatch({ type: TyValue.batteryLevel, paload: batteryLevel });
          break;
        // Battery Power State
        case "00002a1a-0000-1000-8000-00805f9b34fb":
          break;
        case "beb5483e-36e1-4688-b7f5-ea07361b26a8":
          const RGB = parseRGB(value);
          valueDispatch({ type: TyValue.Lights, paload: RGB });
          break;
        default:
          break;
      }
    }
  }
  // Disconnect Function
  async function Disconnect() {
    if (!isConnected) return;
    try {
      await BLEstate.ble.server?.disconnect();
    } catch {}
  }
  function HandelDisconnect(e: Event) {
    sersAndChars.characteristics.forEach((c) => {
      c.removeEventListener("characteristicvaluechanged", HandelValueChange);
    });
    setSersAndChars({ characteristics: [], services: [] });
    console.log(e.target);
    BLEdispatch({ type: Ty.Disconnect });
    setLightChar(undefined);
  }
  return (
    <>
      {blue ? (
        <BLEContext.Provider value={{ BLEstate, BLEdispatch }}>
          <ConnectAndDisconectContext.Provider value={{ Connect, Disconnect }}>
            <ValueContext.Provider value={{ valueState, valueDispatch }}>
              <LightCharContext.Provider value={{ lightChar: lightChar }}>
                {children}
              </LightCharContext.Provider>
            </ValueContext.Provider>
          </ConnectAndDisconectContext.Provider>
        </BLEContext.Provider>
      ) : (
        <div> No Bluetooth Detected</div>
      )}
    </>
  );
};
