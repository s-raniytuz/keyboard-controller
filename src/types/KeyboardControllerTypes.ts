export type ControllerEvent = {
  key: string;
  frequency: number;
  note: string;
};

export type ControllerOutputType = (keyProps: ControllerEvent) => void;

export type ControllerTriggerType = (e: KeyboardEvent) => void;

export type ControllerFrequencyBindingObjectType = {
  [key: string]: { note: string; frequency: number };
};
