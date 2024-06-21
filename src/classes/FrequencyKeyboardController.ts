export default class FrequencyKeyboardController {
  private _baseFrequency: number;
  private _firstOctave: number;
  private _secondOctave: number;
  private _isLinked: boolean;
  private _autoRestart: boolean;
  private _keydownTrigger: (e: KeyboardEvent) => void;
  private _keyupTrigger: (e: KeyboardEvent) => void;
  private _linkedKeydownTrigger: ((e: KeyboardEvent) => void) | undefined;
  private _linkedKeyupTrigger: ((e: KeyboardEvent) => void) | undefined;

  constructor(baseFrequency = 220, lowOctave = 1, highOctave = 2) {
    this._baseFrequency = baseFrequency;
    this._keydownTrigger = (e: KeyboardEvent) => {
      console.log(`Keydown event: ${e.key}`);
    };
    this._keyupTrigger = (e: KeyboardEvent) => {
      console.log(`Keyup event: ${e.key}`);
    };
    this._linkedKeydownTrigger = undefined;
    this._linkedKeyupTrigger = undefined;
    this._firstOctave = lowOctave;
    this._secondOctave = highOctave;
    this._isLinked = false;
    this._autoRestart = false;
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

  set keydownTrigger(handleKeydown: (e: KeyboardEvent) => void) {
    this._keydownTrigger = handleKeydown;
  }
  get keydownTrigger(): (e: KeyboardEvent) => void {
    return this._keydownTrigger;
  }

  set keyupTrigger(handleKeyup: (e: KeyboardEvent) => void) {
    this._keyupTrigger = handleKeyup;
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
