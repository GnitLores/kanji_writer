import { Point } from "../typings/types";

type BoundEvent = {
  getPoint(): Point;
  preventDefault(): void;
};

/** Generic render target */
export default class RenderTargetBase<
  TElement extends
    | HTMLElement
    | SVGElement
    | SVGSVGElement
    | HTMLCanvasElement = HTMLElement
> {
  node: TElement;
  eventMouseDown: any;
  eventTouchStart: any;
  eventMouseMove: any;
  eventTouchMove: any;
  eventMouseUp: any;
  eventTouchEnd: any;

  constructor(node: TElement) {
    this.node = node;
  }

  addPointerStartListener(callback: (arg: BoundEvent) => void) {
    this.eventMouseDown = (evt: any) => {
      callback(this._eventify(evt as MouseEvent, this._getMousePoint));
    };
    this.eventTouchStart = (evt: any) => {
      callback(this._eventify(evt as TouchEvent, this._getTouchPoint));
    };

    this.node.addEventListener("mousedown", this.eventMouseDown);
    this.node.addEventListener("touchstart", this.eventTouchStart);
  }

  addPointerMoveListener(callback: (arg: BoundEvent) => void) {
    this.eventMouseMove = (evt: any) => {
      callback(this._eventify(evt as MouseEvent, this._getMousePoint));
    };
    this.eventTouchMove = (evt: any) => {
      callback(this._eventify(evt as TouchEvent, this._getTouchPoint));
    };

    this.node.addEventListener("mousemove", this.eventMouseMove);
    this.node.addEventListener("touchmove", this.eventTouchMove);
  }

  addPointerEndListener(callback: () => void) {
    this.eventMouseUp = callback;
    this.eventTouchEnd = callback;
    // TODO: find a way to not need global listeners
    document.addEventListener("mouseup", this.eventMouseUp);
    document.addEventListener("touchend", this.eventTouchEnd);
  }

  removeEventListeners() {
    this.node.removeEventListener("mousedown", this.eventMouseDown);
    this.node.removeEventListener("touchstart", this.eventTouchStart);
    this.node.removeEventListener("mousemove", this.eventMouseMove);
    this.node.removeEventListener("touchmove", this.eventTouchMove);
    document.removeEventListener("mouseup", this.eventMouseUp);
    document.removeEventListener("touchend", this.eventTouchEnd);
  }

  getBoundingClientRect() {
    return this.node.getBoundingClientRect();
  }

  updateDimensions(width: string | number, height: string | number) {
    this.node.setAttribute("width", `${width}`);
    this.node.setAttribute("height", `${height}`);
  }

  _eventify<TEvent extends Event>(
    evt: TEvent,
    pointFunc: (event: TEvent) => Point
  ) {
    return {
      getPoint: () => pointFunc.call(this, evt),
      preventDefault: () => evt.preventDefault(),
    };
  }

  _getMousePoint(evt: MouseEvent): Point {
    const { left, top } = this.getBoundingClientRect();
    const x = evt.clientX - left;
    const y = evt.clientY - top;
    return { x, y };
  }

  _getTouchPoint(evt: TouchEvent): Point {
    const { left, top } = this.getBoundingClientRect();
    const x = evt.touches[0].clientX - left;
    const y = evt.touches[0].clientY - top;
    return { x, y };
  }
}
