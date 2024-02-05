// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum XboxButtonMap {
  A = 0,
  B = 1,
  X = 2,
  Y = 3,
  LB = 4,
  RB = 5,
  LT = 6,
  RT = 7,
  Select = 8,
  Start = 9,
  LeftStick = 10,
  RightStick = 11,
  Up = 12,
  Down = 13,
  Left = 14,
  Right = 15,
  Home = 16,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum XboxAxisMap {
  LeftX = 0,
  LeftY = 1,
  RightX = 2,
  RightY = 3,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum PSButtonMap {
  Cross = 0,
  Circle = 1,
  Square = 2,
  Triangle = 3,
  L1 = 4,
  R1 = 5,
  L2 = 6,
  R2 = 7,
  Share = 8,
  Options = 9,
  L3 = 10,
  R3 = 11,
  Up = 12,
  Down = 13,
  Left = 14,
  Right = 15,
  Home = 16,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum PSAxisMap {
  LeftX = 0,
  LeftY = 1,
  RightX = 2,
  RightY = 3,
}

// buttons[0]	Bottom button in right cluster
// buttons[1]	Right button in right cluster
// buttons[2]	Left button in right cluster
// buttons[3]	Top button in right cluster
// buttons[4]	Top left front button
// buttons[5]	Top right front button
// buttons[6]	Bottom left front button
// buttons[7]	Bottom right front button
// buttons[8]	Left button in center cluster
// buttons[9]	Right button in center cluster
// buttons[10]	Left stick pressed button
// buttons[11]	Right stick pressed button
// buttons[12]	Top button in left cluster
// buttons[13]	Bottom button in left cluster
// buttons[14]	Left button in left cluster
// buttons[15]	Right button in left cluster
// buttons[16]	Center button in center cluster
// axes[0]	Horizontal axis for left stick (negative left/positive right)
// axes[1]	Vertical axis for left stick (negative up/positive down)
// axes[2]	Horizontal axis for right stick (negative left/positive right)
// axes[3]	Vertical axis for right stick (negative up/positive down)

export class GamepadManager {
  private updateRafId = 0;
  private _lastTime = 0;
  private _destroyed = false;
  private _updating = false;
  private cached: any = {};

  public deltaTime = 0;

  public onGamepadConnected: null | ((e: GamepadEvent) => void) = null;
  public onGamepadDisconnected: null | ((e: GamepadEvent) => void) = null;

  public update: null | ((data: any)=>any) = (_data: any)=>_data;

  private _gamepadconnectedInst = (e: GamepadEvent) => this._onGamepadConnected(e);
  private _gamepaddisconnectedInst = (e: GamepadEvent) => this._onGamepadDisconnected(e);

  constructor() {
    window.addEventListener('gamepadconnected', this._gamepadconnectedInst);
    window.addEventListener('gamepaddisconnected', this._gamepaddisconnectedInst);

    this._updating = true;
    window.requestAnimationFrame(()=>this._update());
  }

  _onGamepadConnected(e: GamepadEvent) {
    this.onGamepadConnected?.(e);
    if (!this._updating) {
      this._updating = true;
      this.updateRafId = window.requestAnimationFrame(()=>this._update());
    }
  }

  _onGamepadDisconnected(e: GamepadEvent) {
    this.onGamepadDisconnected?.(e);
    if (navigator.getGamepads().filter(i=>!!i).length === 0) {
      this._updating = false;
    }
  }

  _update() {
    if (navigator.getGamepads().filter(i=>!!i).length === 0) {
      this._updating = false;
      return;
    }
    let now = new Date().getTime();
    if (this._lastTime !== 0) {
      this.deltaTime = now - this._lastTime;
    }
    this._lastTime = now;

    let newCached = this.update?.(this.cached);
    this.cached = {...this.cached, ...newCached};

    if (!this._destroyed && this._updating) {
      this.updateRafId = window.requestAnimationFrame(()=>this._update());
    }
  }

  setData(data: any) {
    this.cached = { ...this.cached, ...data };
  }

  private exec(func: (gamepad: Gamepad)=>any) {
    let gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      let gamepad = gamepads[i];
      if (gamepad) {
        return func(gamepad);
      }
    }
  }

  getButtonState(buttonIndex: number): GamepadButton {
    return this.exec(gamepad => gamepad?.buttons?.[buttonIndex]);
  }

  getAxisState(axisIndex: number): number {
    return this.exec(gamepad => gamepad?.axes?.[axisIndex]);
  }

  playEffect(type: 'dual-rumble', config: GamepadEffectParameters) {
    return this.exec(gamepad => gamepad?.vibrationActuator?.playEffect(type, config));
  }

  onDestroy() {
    window.removeEventListener('gamepadconnected', this._gamepadconnectedInst);
    window.removeEventListener('gamepaddisconnected', this._gamepaddisconnectedInst);

    this._destroyed = true;
    this._updating = false;
    window.cancelAnimationFrame(this.updateRafId);
  }

}