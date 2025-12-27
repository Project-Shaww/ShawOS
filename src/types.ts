import { FileSystem as _fs } from "./core/FileSystem";
import { ShawOS as _shawOS } from "./shawos";
import { WindowManager as _windowManager } from "./managers/WindowManager";

export interface HTMLContainer extends HTMLDivElement {
    getElementById(_id: string): HTMLElement | null;
    createElement(_tag: string): HTMLElement;
}
export interface WindowManager extends _windowManager {}
export interface FileSystem extends _fs {}
export interface ShawOS extends _shawOS {}