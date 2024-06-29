# Keyboard Midi Controller 🎹

An easy-to-use library made for emulating a MIDI device using a keyboard.  
Typescript and Javascript compatible.

## Installation

    npm i keyboard-midi-controller

## Getting Started

First, you have to import the library:

    import { KeyboardMidiController } from 'keyboard-midi-controller'

<br>

The library exposes the "KeyboardMidiController" class, which needs to be instantiated in order to make the controller usable in your app.

    const controller = new KeyboardMidiController()

<br>

To make the controller work you need to link it to your page

    controller.link()

<br>

Now, if you open developer tools and press a key, you should be able to see logs such as these:

    Attack Event > {key: 'z', frequency: 261.624, note: 'C4'}
    Release Event > {key: 'z', frequency: 261.624, note: 'C4'}

## Making it work with your functions

    // defenition

    controllerOutputAttack: ControllerOutputType;
    controllerOutputRelease: ControllerOutputType;

To access attack and release event objects, you have to pass a callback function to controllerOutputAttack and controllerOutputRelease

    function myAttackCallback(e: ControllerEvent) {
        console.log(`my attack event note: ${e.note}`)
    }
    function myReleaseCallback(e: ControllerEvent) {
        console.log(`my release event note: ${e.note}`)
    }

    controller.controllerOutputAttack = myAttackCallback
    controller.controllerOutputRelease = myReleaseCallback

<br>

Your custom callback will override the functions' default behaviour. To return the default behaviour back set a field to undefined.

    controller.controllerOutputAttack = undefined

## Basics

### Base Frequency

    baseFrequency: number = 440

A field that is used to calculate frequencies of all notes. By default it is set to 440hz.

baseFrequency can not be lower than 1 and higher than 20000

    // setting a custom value

    controller.baseFrequency = 1000

### Octaves

    firstOctave: number = 4
    secondOctave: number = 5

Octave fields control the octave that you play in.

An octave can not have a value lower than 1 and higher than 7

    // setting a custom value

    controller.firstOctave = 3

### Constructor

    constructor(
        controllerOutputAttack?: ControllerOutputType,
        controllerOutputRelease?: ControllerOutputType,
        baseFrequency: number = 440,
        firstOctave: number = 4,
        secondOctave: number = 5
    )

## Additional options

### Event Trigger

## Methods
