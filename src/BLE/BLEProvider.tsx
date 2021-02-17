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
type HeartRateValue = {
  heartRate?: number;
  contactDetected?: boolean;
  energyExpended?: number;
  rrIntervals?: number[];
};
export type valueStateType = {
  heartRate?: HeartRateValue;
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
  heartRate = "HeartRate",
  temperature = "Temperature",
  humidity = "Humidity",
}
export type ValueActions =
  | { type: TyValue.batteryCharging; paload: boolean }
  | { type: TyValue.batteryDischarging; paload: boolean }
  | { type: TyValue.batteryLevel; paload: number }
  | { type: TyValue.heartRate; paload: HeartRateValue }
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
    case TyValue.heartRate:
      return { ...state, heartRate: action.paload };
    case TyValue.humidity:
      return {
        ...state,
        environmentalSensing: {
          ...state.environmentalSensing,
          temperature: action.paload,
        },
      };
    case TyValue.temperature:
      return {
        ...state,
        environmentalSensing: {
          ...state.environmentalSensing,
          humidity: action.paload,
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
    availability?: boolean;
    connected?: boolean;
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
      return { ...state, data: { availability: action.payload } };
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
          connected: true,
          connecting: false,
          failed: false,
        },
      };
    case Ty.Disconnect:
      return {
        data: { ...state.data, connected: false, failed: false },
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

function parseHeartRate(value: DataView) {
  const data = value;
  let result: {
    heartRate?: number;
    contactDetected?: boolean;
    energyExpended?: number;
    rrIntervals?: number[];
  } = {
    heartRate: 0,
    contactDetected: undefined,
    energyExpended: 0,
    rrIntervals: [],
  };
  if (!data) return result;
  let flags = data.getUint8(0);
  let rate16Bits = flags & 0x1;

  let index = 1;
  if (rate16Bits) {
    result.heartRate = data.getUint16(index, /*littleEndian=*/ true);
    index += 2;
  } else {
    result.heartRate = data.getUint8(index);
    index += 1;
  }
  let contactDetected = flags & 0x2;
  let contactSensorPresent = flags & 0x4;
  if (contactSensorPresent) {
    result.contactDetected = !!contactDetected;
  }
  let energyPresent = flags & 0x8;
  if (energyPresent) {
    result.energyExpended = data.getUint16(index, /*littleEndian=*/ true);
    index += 2;
  }
  let rrIntervalPresent = flags & 0x10;
  if (rrIntervalPresent) {
    let rrIntervals: number[] = [];
    for (; index + 1 < data.byteLength; index += 2) {
      rrIntervals.push(data.getUint16(index, /*littleEndian=*/ true));
    }
    result.rrIntervals = rrIntervals;
  }
  return result;
}

interface ServicesAndCharacteristics {
  services: BluetoothRemoteGATTService[];
  characteristics: BluetoothRemoteGATTCharacteristic[];
}
export const BLEProvider: FC = ({ children }) => {
  let blue = navigator.bluetooth ? true : false;
  const [BLEstate, BLEdispatch] = useReducer(bleReducer, { data: {}, ble: {} });
  const { connected, connecting, availability, failed } = BLEstate.data;

  const [valueState, valueDispatch] = useReducer(valueReducer, {});
  const [sersAndChars, setSersAndChars] = useState<ServicesAndCharacteristics>({
    services: [],
    characteristics: [],
  });
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
    if (!availability) return;
    if (connected) return;
    if (connecting) return;
    let device: BluetoothDevice;
    let server: BluetoothRemoteGATTServer;
    try {
      BLEdispatch({ type: Ty.Connecting });
      device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "battery_service",
          "heart_rate",
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
      services.forEach(async (v) => {
        characteristics = await v.getCharacteristics();
        setSersAndChars((prevState) => ({
          ...prevState,
          characteristics: [...prevState.characteristics, ...characteristics],
        }));

        console.log(characteristics);
        characteristics.forEach(async (c) => {
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
          const a = value.getUint16(0);
          valueDispatch({ type: TyValue.temperature, paload: a });
          break;
        //Humidity
        case "00002a6f-0000-1000-8000-00805f9b34fb":
          const hum = value.getUint16(0);
          valueDispatch({ type: TyValue.humidity, paload: hum });
          break;
        // Heart Rate Measurement
        case "00002a37-0000-1000-8000-00805f9b34fb":
          const heartRate = parseHeartRate(value);
          valueDispatch({ type: TyValue.heartRate, paload: heartRate });
          break;
        // Battery Level
        case "00002a19-0000-1000-8000-00805f9b34fb":
          const batteryLevel = value.getUint8(0);
          valueDispatch({ type: TyValue.batteryLevel, paload: batteryLevel });
          break;
        // Battery Power State
        case "00002a1a-0000-1000-8000-00805f9b34fb":
          break;
        default:
          break;
      }
    }
  }
  // Disconnect Function
  async function Disconnect() {
    if (!connected) return;
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
  }
  return (
    <>
      {blue ? (
        <BLEContext.Provider value={{ BLEstate, BLEdispatch }}>
          <ConnectAndDisconectContext.Provider value={{ Connect, Disconnect }}>
            <ValueContext.Provider value={{ valueState, valueDispatch }}>
              {children}
            </ValueContext.Provider>
          </ConnectAndDisconectContext.Provider>
        </BLEContext.Provider>
      ) : (
        <div> No Bluetooth Detected</div>
      )}
    </>
  );
};
