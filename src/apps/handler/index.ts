import Apps from './Apps.js';
import AppSupportedFiles from './AppSupportedFiles.js';
import type { HTMLContainer, WindowManager, FileSystem, ShawOS } from '../../types'
export class AppHandler {
    windowManager: WindowManager;
    fs: FileSystem;
    shawOS: ShawOS;
    constructor(windowManager: WindowManager, fileSystem: FileSystem, shawOS: ShawOS) {
        this.windowManager = windowManager;
        this.fs = fileSystem;
        this.shawOS = shawOS;
    }

    getAppClassByName(appName: string) {
        return (Apps as any)[appName] || null;
    }

    getAppClassByFileType(fileType: string) {
        return this.getAppClassByName((AppSupportedFiles as any)[fileType]) || null;
    }

    openApp(AppClass: any, appSettings: any, after = {}) {
        const container = this.windowManager.createWindow(...(appSettings.window as [string, string, any, number, number]));
        if (container) {
            var appInstance;
            if (appSettings.needsSystem) { appInstance = new AppClass(container, this.fs, this.shawOS); }
            else { appInstance = new AppClass(container, this.fs); }
            if (appSettings.after) {
                try{ appSettings.after({ app: appInstance, fs: this.fs, shawOS: this.shawOS, other: after })}
                catch(e){ console.error(e); }
            }
        }
    }

    openAppByName(appName: string) {
        const AppClass = this.getAppClassByName(appName);
        if (!AppClass) return;
        const appSettings = AppClass.appSettings({ fs: this.fs });
        this.openApp(AppClass, appSettings);
    }

    fileOpener(file: any) {
        const AppClass = this.getAppClassByFileType(file.name.split('.').pop());
        if (!AppClass) return false;
        const appSettings = AppClass.appFileOpenerSettings({ fs: this.fs, filename: file.name });
        this.openApp(AppClass, appSettings, { filename: file.name });
        return true;
    }

    static run(windowManager: WindowManager, fileSystem: FileSystem, shawOS: ShawOS) {
        return new AppHandler(windowManager, fileSystem, shawOS);
    }
}