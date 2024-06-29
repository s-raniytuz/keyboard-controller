export interface KeyPropsType {
  key: string;
  frequency: number;
}

export type ControllerOutputType = (keyProps: KeyPropsType) => void;
