import Apps from './Apps.js';
import AppSupportedFiles from './AppSupportedFiles.js';
import type { HTMLContainer, WindowManager, FileSystem, ShawOS } from '../../types'
export class AppHandler {
    windowManager: WindowManager;
    fs: FileSystem;
    shawOS: ShawOS;
    appInstances: Map<string, any>;
    apps: any;
    appSupportedFiles: any;
    constructor(windowManager: WindowManager, fileSystem: FileSystem, shawOS: ShawOS) {
        this.windowManager = windowManager;
        this.fs = fileSystem;
        this.shawOS = shawOS;
        this.appInstances = new Map<string, any>();
        this.apps = Apps;
        this.appSupportedFiles = AppSupportedFiles;
    }

    getAppClassByName(appName: string) {
        return (this.apps as any)[appName] || null;
    }

    getAppClassByFileType(fileType: string) {
        return this.getAppClassByName((this.appSupportedFiles as any)[fileType]) || null;
    }

    openApp(AppClass: any, appSettings: any, after = {}) {
        const container = this.windowManager.createWindow(...(appSettings.window as [string, string, any, number, number]), () => { this.appInstances.delete(appSettings.window[0]); });
        if (container) {
            var appInstance;
            if (appSettings.needsSystem) { appInstance = new AppClass(container, this.fs, this.shawOS); }
            else { appInstance = new AppClass(container, this.fs); }
            if (appSettings.after) {
                try{ appSettings.after({ app: appInstance, fs: this.fs, shawOS: this.shawOS, other: after })}
                catch(e){ console.error(e); }
            }
            this.appInstances.set(appSettings.window[0], appInstance);
            return appInstance;
        }
    }

    openAppByName(appName: string) {
        const AppClass = this.getAppClassByName(appName);
        if (!AppClass) return;
        const appSettings = AppClass.appSettings({ fs: this.fs });
        const appInstance = this.openApp(AppClass, appSettings);
        return appInstance;
    }

    fileOpener(file: any) {
        const AppClass = this.getAppClassByFileType(file.name.split('.').pop());
        if (!AppClass) return null;
        const appSettings = AppClass.appFileOpenerSettings({ fs: this.fs, filename: file.name });
        const appInstance = this.openApp(AppClass, appSettings, { filename: file.name });
        return appInstance;
    }

    static run(windowManager: WindowManager, fileSystem: FileSystem, shawOS: ShawOS) {
        return new AppHandler(windowManager, fileSystem, shawOS);
    }
}