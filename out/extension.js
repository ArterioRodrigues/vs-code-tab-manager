"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function updateStatusBar(statusBarItem, maxTabs) {
    const groups = vscode.window.tabGroups.all;
    const groupCounts = groups.map(g => g.tabs.length).join(', ');
    statusBarItem.text = `[ ${groupCounts} | max: ${maxTabs} ]`;
}
function activate(context) {
    let maxTabs = vscode.workspace.getConfiguration('tabManager').get('maxTabs') ?? 5;
    const helloWorldCommand = vscode.commands.registerCommand('tab-manager.tabManager', () => { });
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    updateStatusBar(statusBarItem, maxTabs);
    statusBarItem.show();
    const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('tabManager.maxTabs')) {
            maxTabs = vscode.workspace.getConfiguration('tabManager').get('maxTabs') ?? 5;
        }
        updateStatusBar(statusBarItem, maxTabs);
    });
    const activeEditorListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (!editor) {
            return;
        }
        const uri = editor.document.uri.toString();
        for (const group of vscode.window.tabGroups.all) {
            const indexInGroup = group.tabs.findIndex((tab) => {
                if (!(tab.input instanceof vscode.TabInputText)) {
                    return false;
                }
                return tab.input.uri.toString() === uri;
            });
            if (indexInGroup !== -1) {
                for (let i = 0; i < indexInGroup; i++) {
                    vscode.commands.executeCommand('workbench.action.moveEditorLeftInGroup');
                }
                break;
            }
        }
        updateStatusBar(statusBarItem, maxTabs);
    });
    const tabChangeListener = vscode.window.tabGroups.onDidChangeTabs((e) => {
        for (const group of vscode.window.tabGroups.all) {
            if (group.tabs.length > maxTabs) {
                const tabToClose = group.tabs[group.tabs.length - 1];
                if (tabToClose) {
                    vscode.window.tabGroups.close(tabToClose);
                }
            }
        }
        updateStatusBar(statusBarItem, maxTabs);
    });
    context.subscriptions.push(helloWorldCommand, activeEditorListener, tabChangeListener, configListener, statusBarItem);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map