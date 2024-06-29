import {
  ControllerEvent,
  ControllerOutputType,
  ControllerTriggerType,
  ControllerFrequencyBindingObjectType,
} from "../types/KeyboardControllerTypes";

export class KeyboardMidiController {
  private _baseFrequency: number;
  private _firstOctave: number;
  private _secondOctave: number;
  private _isLinked: boolean;
  private _autoRestart: boolean;
  private _frequencyMappingObject: ControllerFrequencyBindingObjectType;
  private _bindedKeys: string[];
  private _keydownTrigger: ControllerTriggerType;
  private _keyupTrigger: ControllerTriggerType;
  private _linkedKeydownTrigger: ControllerTriggerType | undefined;
  private _linkedKeyupTrigger: ControllerTriggerType | undefined;
  private _controllerOutputAttack: ControllerOutputType;
  private _controllerOutputRelease: ControllerOutputType;

  constructor(
    controllerOutputAttack?: ControllerOutputType,
    controllerOutputRelease?: ControllerOutputType,
    baseFrequency: number = 440,
    firstOctave: number = 4,
    secondOctave: number = 5
  ) {
    this.baseFrequency = baseFrequency;
    this.firstOctave = firstOctave;
    this.secondOctave = secondOctave;
    this._isLinked = false;
    this.autoRestart = false;
    this._frequencyMappingObject = {
      z: {
        frequency: (1.1892 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "C" + this.firstOctave,
      },
      q: {
        frequency: (1.1892 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "C" + this.secondOctave,
      },

      s: {
        frequency: (1.2599 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "C#" + this.firstOctave,
      },
      2: {
        frequency: (1.2599 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "C#" + this.secondOctave,
      },

      x: {
        frequency: (1.3348 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "D" + this.firstOctave,
      },
      w: {
        frequency: (1.3348 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "D" + this.secondOctave,
      },

      d: {
        frequency: (1.4142 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "D#" + this.firstOctave,
      },
      3: {
        frequency: (1.4142 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "D#" + this.secondOctave,
      },

      c: {
        frequency: (1.4983 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "E" + this.firstOctave,
      },
      e: {
        frequency: (1.4983 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "E" + this.secondOctave,
      },

      v: {
        frequency: (1.5874 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "F" + this.firstOctave,
      },
      r: {
        frequency: (1.5874 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "F" + this.secondOctave,
      },

      g: {
        frequency: (1.6818 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "F#" + this.firstOctave,
      },
      5: {
        frequency: (1.6818 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "F#" + this.secondOctave,
      },

      b: {
        frequency: (1.7818 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "G" + this.firstOctave,
      },
      t: {
        frequency: (1.7818 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "G" + this.secondOctave,
      },

      h: {
        frequency: (1.8897 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "G#" + this.firstOctave,
      },
      6: {
        frequency: (1.8897 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "G#" + this.secondOctave,
      },

      n: {
        frequency: this.baseFrequency * (this.firstOctave / 4),
        note: "A" + this.firstOctave,
      },
      y: {
        frequency: this.baseFrequency * (this.secondOctave / 4),
        note: "A" + this.secondOctave,
      },

      j: {
        frequency: (1.0595 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "A#" + this.firstOctave,
      },
      u: {
        frequency: (1.0595 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "A#" + this.secondOctave,
      },

      m: {
        frequency: (1.1225 / 2) * this.baseFrequency * (this.firstOctave / 4),
        note: "B" + this.firstOctave,
      },
      8: {
        frequency: (1.1225 / 2) * this.baseFrequency * (this.secondOctave / 4),
        note: "B" + this.secondOctave,
      },
    };

    this._bindedKeys = Object.keys(this._frequencyMappingObject);

    this._keydownTrigger = (e: KeyboardEvent) => {
      if (!e.repeat && this._bindedKeys.includes(e.key.toLowerCase())) {
        this._controllerOutputAttack({
          key: e.key,
          ...this._frequencyMappingObject[e.key.toLowerCase()],
        });
      }
    };

    this._keyupTrigger = (e: KeyboardEvent) => {
      if (!e.repeat && this._bindedKeys.includes(e.key.toLowerCase())) {
        this._controllerOutputRelease({
          key: e.key,
          ...this._frequencyMappingObject[e.key.toLowerCase()],
        });
      }
    };

    this._linkedKeydownTrigger = undefined;
    this._linkedKeyupTrigger = undefined;

    if (!controllerOutputAttack) {
      this._controllerOutputAttack = (keyProps: ControllerEvent) => {
        console.log("Attack Event", keyProps);
      };
    } else {
      this._controllerOutputAttack = controllerOutputAttack;
    }

    if (!controllerOutputRelease) {
      this._controllerOutputRelease = (keyProps: ControllerEvent) => {
        console.log("Release Event", keyProps);
      };
    } else {
      this._controllerOutputRelease = controllerOutputRelease;
    }
  }

  set baseFrequency(newBaseFrequency: number) {
    if (newBaseFrequency > 0 && newBaseFrequency <= 20000) {
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

  set keydownTrigger(handleKeydown: ControllerTriggerType) {
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
  get keyupTrigger(): ControllerTriggerType {
    return this._keyupTrigger;
  }

  get linkedKeydownTrigger(): ControllerTriggerType | undefined {
    return this._linkedKeydownTrigger;
  }

  get linkedKeyupTrigger(): ControllerTriggerType | undefined {
    return this._linkedKeyupTrigger;
  }

  set controllerOutputAttack(
    newOutputAttack: ControllerOutputType | undefined
  ) {
    if (newOutputAttack) {
      this._controllerOutputAttack = newOutputAttack;
    } else {
      this._controllerOutputAttack = (keyProps: ControllerEvent) => {
        console.log("Attack Event", keyProps);
      };
    }
  }
  get controllerOutputAttack(): ControllerOutputType {
    return this._controllerOutputAttack;
  }

  set controllerOutputRelease(
    newOutputRelease: ControllerOutputType | undefined
  ) {
    if (newOutputRelease) {
      this._controllerOutputRelease = newOutputRelease;
    } else {
      this._controllerOutputRelease = (keyProps: ControllerEvent) => {
        console.log("Release Event", keyProps);
      };
    }
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
          "The controller is already linked. To use a new trigger function unlink the controller and link it again, or use .restart()"
        );
      } else {
        throw new Error("The controller is already linked");
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
    this._autoRestart = false;
    this._controllerOutputAttack = (keyProps: ControllerEvent) => {
      console.log("Attack Event", keyProps);
    };
    this._controllerOutputRelease = (keyProps: ControllerEvent) => {
      console.log("Release Event", keyProps);
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
