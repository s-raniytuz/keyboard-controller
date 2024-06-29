import {
  KeyPropsType,
  ControllerOutputType,
} from "../types/KeyboardControllerTypes";

export default class FrequencyKeyboardController {
  private _baseFrequency: number;
  private _firstOctave: number;
  private _secondOctave: number;
  private _isLinked: boolean;
  private _autoRestart: boolean;
  private _frequencyMappingObject: { [key: string]: number };
  private _bindedKeys: string[];
  private _keydownTrigger: (e: KeyboardEvent) => void;
  private _keyupTrigger: (e: KeyboardEvent) => void;
  private _linkedKeydownTrigger: ((e: KeyboardEvent) => void) | undefined;
  private _linkedKeyupTrigger: ((e: KeyboardEvent) => void) | undefined;
  private _controllerOutputAttack: ControllerOutputType;
  private _controllerOutputRelease: ControllerOutputType;

  constructor(
    controllerOutputAttack?: (keyPropertyObject: KeyPropsType) => void,
    controllerOutputRelease?: (keyPropertyObject: KeyPropsType) => void,
    autoRestart: boolean = false,
    baseFrequency: number = 440,
    lowOctave: number = 1,
    highOctave: number = 2
  ) {
    this._baseFrequency = baseFrequency;
    this._firstOctave = lowOctave;
    this._secondOctave = highOctave;
    this._isLinked = false;
    this._autoRestart = autoRestart;
    this._frequencyMappingObject = {
      z: (1.1892 / 2) * this._baseFrequency * this._firstOctave,
      q: (1.1892 / 2) * this._baseFrequency * this._secondOctave,

      s: 1.2599 / 2,
      2: 1.2599 / 2,

      x: 1.3348 / 2,
      w: 1.3348 / 2,

      d: 1.4142 / 2,
      3: 1.4142 / 2,

      c: 1.4983 / 2,
      e: 1.4983 / 2,

      v: 1.5874 / 2,
      r: 1.5874 / 2,

      g: 1.6818 / 2,
      5: 1.6818 / 2,

      b: 1.7818 / 2,
      t: 1.7818 / 2,

      h: 1.8897 / 2,
      6: 1.8897 / 2,

      n: 1,
      y: 1,

      j: 1.0595,
      u: 1.0595,

      m: 1.1225,
      8: 1.1225,
    };

    this._bindedKeys = Object.keys(this._frequencyMappingObject);

    this._keydownTrigger = (e: KeyboardEvent) => {
      if (!e.repeat && this._bindedKeys.includes(e.key)) {
        this._controllerOutputAttack({
          key: e.key,
          frequency: this._frequencyMappingObject[e.key],
        });
      }
    };

    this._keyupTrigger = (e: KeyboardEvent) => {
      if (!e.repeat && this._bindedKeys.includes(e.key)) {
        this._controllerOutputRelease({
          key: e.key,
          frequency: this._frequencyMappingObject[e.key],
        });
      }
    };

    this._linkedKeydownTrigger = undefined;
    this._linkedKeyupTrigger = undefined;

    if (!controllerOutputAttack) {
      this._controllerOutputAttack = (keyProps: KeyPropsType) => {
        console.log(`Controller output 'Attack': ${keyProps.key}`);
      };
    } else {
      this._controllerOutputAttack = controllerOutputAttack;
    }

    if (!controllerOutputRelease) {
      this._controllerOutputRelease = (keyProps: KeyPropsType) => {
        console.log(`Controller output 'Release': ${keyProps.key}`);
      };
    } else {
      this._controllerOutputRelease = controllerOutputRelease;
    }
  }

  set baseFrequency(newBaseFrequency: number) {
    if (newBaseFrequency > 0 && newBaseFrequency < 30000) {
      this._baseFrequency = newBaseFrequency;
    } else if (newBaseFrequency < 0) {
      throw new Error(
        "Base frequency boundaries exceeded. Base frequency can not be lower than 0"
      );
    } else {
      throw new Error(
        "Base frequency boundaries exceeded. Base frequency can not be higher than 30000"
      );
    }
  }
  get baseFrequency(): number {
    return this._baseFrequency;
  }

  set firstOctave(newFirstOctave: number) {
    if (newFirstOctave >= 1 && newFirstOctave <= 7) {
      this._firstOctave = newFirstOctave;
    } else if (newFirstOctave < 1) {
      throw new Error(
        "Octave out of range. Please select an octave between 1 and 7"
      );
    } else {
      throw new Error(
        "Octave out of range. Please select an octave between 1 and 7"
      );
    }
  }
  get firstOctave(): number {
    return this._firstOctave;
  }

  set secondOctave(newSecondOctave: number) {
    if (newSecondOctave >= 1 && newSecondOctave <= 7) {
      this._secondOctave = newSecondOctave;
    } else if (newSecondOctave < 1) {
      throw new Error(
        "Octave out of range. Please select an octave between 1 and 7"
      );
    } else {
      throw new Error(
        "Octave out of range. Please select an octave between 1 and 7"
      );
    }
  }
  get secondOctave(): number {
    return this._secondOctave;
  }

  get isLinked(): boolean {
    return this._isLinked;
  }

  get autoRestart(): boolean {
    return this._autoRestart;
  }
  set autoRestart(restartOption: boolean) {
    this._autoRestart = restartOption;
  }

  set keydownTrigger(handleKeydown: (e: KeyboardEvent) => void) {
    if (handleKeydown != this._keydownTrigger) {
      this._keydownTrigger = handleKeydown;
      if (this._autoRestart) {
        this.restart();
      }
    } else {
      throw new Error(
        "The new keydown trigger is equal to the keydown trigger stored in the controller. Pass a new function to update the trigger."
      );
    }
  }
  get keydownTrigger(): (e: KeyboardEvent) => void {
    return this._keydownTrigger;
  }

  set keyupTrigger(handleKeyup: (e: KeyboardEvent) => void) {
    if (handleKeyup != this._keyupTrigger) {
      this._keyupTrigger = handleKeyup;
      if (this._autoRestart) {
        this.restart();
      }
    } else {
      throw new Error(
        "The new keyup trigger is equal to the keyup trigger stored in the controller. Pass a new function to update the trigger."
      );
    }
  }
  get keyupTrigger(): (e: KeyboardEvent) => void {
    return this._keyupTrigger;
  }

  get linkedKeydownTrigger(): ((e: KeyboardEvent) => void) | undefined {
    return this._linkedKeydownTrigger;
  }

  get linkedKeyupTrigger(): ((e: KeyboardEvent) => void) | undefined {
    return this._linkedKeyupTrigger;
  }

  set controllerOutputAttack(newOutputAttack: ControllerOutputType) {
    this._controllerOutputAttack = newOutputAttack;
  }
  get controllerOutputAttack(): ControllerOutputType {
    return this._controllerOutputAttack;
  }

  set controllerOutputRelease(newOutputRelease: ControllerOutputType) {
    this._controllerOutputRelease = newOutputRelease;
  }
  get controllerOutputRelease(): ControllerOutputType {
    return this._controllerOutputRelease;
  }

  link() {
    if (this._isLinked === false) {
      document.addEventListener("keydown", this._keydownTrigger);
      this._linkedKeydownTrigger = this._keydownTrigger;

      document.addEventListener("keyup", this._keyupTrigger);
      this._linkedKeyupTrigger = this._keyupTrigger;

      this._isLinked = true;
    } else {
      if (
        this._keydownTrigger != this._linkedKeydownTrigger ||
        this._keyupTrigger != this._linkedKeyupTrigger
      ) {
        throw new Error(
          "The FrequencyKeyboardController is already linked. To use a new trigger function unlink the controller and link it again, or use .restart()"
        );
      } else {
        throw new Error("The FrequencyKeyboardController is already linked");
      }
    }
  }

  unlink() {
    if (
      this._isLinked === true &&
      this._linkedKeydownTrigger &&
      this._linkedKeyupTrigger
    ) {
      document.removeEventListener("keydown", this._linkedKeydownTrigger);
      document.removeEventListener("keyup", this._linkedKeyupTrigger);
      this._linkedKeydownTrigger = undefined;
      this._linkedKeyupTrigger = undefined;
      this._isLinked = false;
    }
  }

  reset() {
    if (this._isLinked) {
      this.unlink();
    }
    this._baseFrequency = 220;
    this._firstOctave = 1;
    this._secondOctave = 2;
    this._keydownTrigger = (e: KeyboardEvent) => {
      console.log(`Keydown event: ${e.key}`);
    };
    this._keyupTrigger = (e: KeyboardEvent) => {
      console.log(`Keyup event: ${e.key}`);
    };
  }

  restart() {
    if (
      this.isLinked &&
      this._linkedKeydownTrigger &&
      this._linkedKeyupTrigger
    ) {
      // Both keydown and keyup functions are different from the linked ones
      if (
        this._linkedKeydownTrigger != this._keydownTrigger &&
        this._linkedKeyupTrigger != this._keyupTrigger
      ) {
        document.removeEventListener("keydown", this._linkedKeydownTrigger);
        document.removeEventListener("keyup", this._linkedKeyupTrigger);

        document.addEventListener("keydown", this._keydownTrigger);
        document.addEventListener("keyup", this._keyupTrigger);
        this._linkedKeydownTrigger = this._keydownTrigger;
        this._linkedKeyupTrigger = this._keyupTrigger;
      }
      // Only the keydown function is different from the linked one
      else if (
        this._linkedKeydownTrigger != this._keydownTrigger &&
        this._linkedKeyupTrigger == this._keyupTrigger
      ) {
        document.removeEventListener("keydown", this._linkedKeydownTrigger);

        document.addEventListener("keydown", this._keydownTrigger);
        this._linkedKeydownTrigger = this._keydownTrigger;
      }
      // Only the keyup function is different from the linked one
      else if (
        this._linkedKeydownTrigger == this._keydownTrigger &&
        this._linkedKeyupTrigger != this._keyupTrigger
      ) {
        document.removeEventListener("keyup", this._linkedKeyupTrigger);

        document.addEventListener("keyup", this._keyupTrigger);
        this._linkedKeyupTrigger = this._keyupTrigger;
      }
      // Both functions are unchanged
      else {
        throw new Error(
          "Both keydown and keyup triggers are already linked, restart can not be performed. Change 'keydownTrigger' or 'keyupTrigger' and try again."
        );
      }
    } else if (!this.isLinked) {
      throw new Error(
        "The controller is not linked. 'restart()' can be performed only on linked controllers. Use 'link()' on a controller before 'restart()'"
      );
    } else {
      throw new Error(
        "An unknown error has occured. If this error keeps occuring, consider resetting the controller."
      );
    }
  }
}
