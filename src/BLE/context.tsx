import { createContext, Dispatch, FC, useEffect, useReducer } from "react";

export type servicesState = {
  allServices?: BluetoothServiceUUID[];
  selectedServices?: BluetoothServiceUUID;
  selectedChar?: BluetoothCharacteristicUUID;
  services?: serviceI[];
};
export enum TyS {
  addSer = "AddService",
  addChar = "AddChar",
}
type characteristicI = {
  name: string;
  characteristicUUID: BluetoothCharacteristicUUID;
  characteristic: BluetoothRemoteGATTCharacteristic;
};
type serviceI = {
  serviceUUID: BluetoothServiceUUID;
  service?: BluetoothRemoteGATTService;
  characteristics?: characteristicI[];
};

type ServiceActions =
  | {
      type: TyS.addSer;
      payload: serviceI;
    }
  | {
      type: TyS.addChar;
      payload: { s: BluetoothServiceUUID; c: characteristicI };
    };

const servicesReducer = (state: servicesState, action: ServiceActions) => {
  switch (action.type) {
    case TyS.addSer:
      if (state.services !== undefined)
        return { ...state, services: [action.payload, ...state.services] };
      else {
        return { ...state, services: [action.payload] };
      }
    case TyS.addChar:
      const x = state.services?.find((x) => x.serviceUUID === action.payload.s);

      return { ...state };
    default:
      return { ...state };
  }
};
export const ServicesContext = createContext<{
  serState: servicesState;
  serDispatch: Dispatch<ServiceActions>;
}>({ serState: {}, serDispatch: () => null });

type ble = {
  device?: BluetoothDevice;
  server?: BluetoothRemoteGATTServer;
  services?: BluetoothRemoteGATTService[];
  characteristics?: BluetoothCharacteristicProperties[];
};
type BleState = {
  data: {
    availability?: boolean;
    connected?: boolean;
  };
  ble: ble;
};

export enum Ty {
  AvailabilityChanged = "AvailabilityChanged",
  Connected = "Connected",
  Disconnect = "Disconnect",
}

export type ConnectionActions =
  | {
      type: Ty.AvailabilityChanged;
      payload: boolean;
    }
  | { type: Ty.Connected; payload: ble }
  | { type: Ty.Disconnect };

const bleReducer = (state: BleState, action: ConnectionActions): BleState => {
  switch (action.type) {
    case Ty.AvailabilityChanged:
      return { ...state, data: { availability: action.payload } };
    case Ty.Connected:
      return {
        ...state,
        ble: action.payload,
        data: { ...state.data, connected: true },
      };
    case Ty.Disconnect:
      return { data: { ...state.data, connected: false }, ble: {} };
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

interface servicesType {
  serviceUUID: BluetoothServiceUUID;
  characteristicUUID: BluetoothCharacteristicUUID[];
}

export const BLEProvider: FC = ({ children }) => {
  let el = !!navigator.bluetooth;
  const [valueState, valueDispatch] = useReducer(valueReducer, {});
  const [state, dispatch] = useReducer(bleReducer, { data: {}, ble: {} });
  const [serState, serDispatch] = useReducer(servicesReducer, {});
  function handleAvailabilityChanged(e: any) {
    dispatch({ type: Ty.AvailabilityChanged, payload: e.target });
  }

  const allServices: servicesType[] = [
    {
      serviceUUID: "battery_service",
      characteristicUUID: ["battery_level", "battery_level_state"],
    },
    {
      serviceUUID: "heart_rate",
      characteristicUUID: ["heart_rate_measurement"],
    },
    {
      serviceUUID: "environmental_sensing",
      characteristicUUID: ["temperature", "humidity"],
    },
  ];

  useEffect(() => {
    navigator.bluetooth?.getAvailability().then((x) => {
      dispatch({ type: Ty.AvailabilityChanged, payload: x });
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

  function HandelDisconnect(e: Event) {
    console.log(e.target);
    dispatch({ type: Ty.Disconnect });
  }
  useEffect(() => {
    state.ble.device?.addEventListener(
      "gattserverdisconnected",
      HandelDisconnect
    );
    return () => {
      state.ble.device?.removeEventListener(
        "gattserverdisconnected",
        HandelDisconnect
      );
    };
  }, [state.ble.device]);

  return (
    <>
      <BLEContext.Provider value={{ BLEstate: state, BLEdispatch: dispatch }}>
        <ServicesContext.Provider value={{ serState, serDispatch }}>
          <ValueContext.Provider value={{ valueState, valueDispatch }}>
            {el ? children : "Not Supported"}
          </ValueContext.Provider>
        </ServicesContext.Provider>
      </BLEContext.Provider>
    </>
  );
};
