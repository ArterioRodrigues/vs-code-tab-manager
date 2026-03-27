import * as vscode from 'vscode';
import { TabTracker } from './tabTracker';


function updateStatusBar(statusBarItem: vscode.StatusBarItem, maxTabs: number) {
    const allTabs = vscode.window.tabGroups.all.flatMap((group) => group.tabs);
    statusBarItem.text = "[ " +  allTabs.length + " | " + maxTabs.toString() + " ]" ;
}

export function activate(context: vscode.ExtensionContext) {
    const tabTracker = new TabTracker();

	let maxTabs: number = vscode.workspace.getConfiguration('tabManager').get('maxTabs') ?? 5;
    const helloWorldCommand = vscode.commands.registerCommand('tab-manager.tabManager', () => {});

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
        if (!editor) { return; }

        const uri = editor.document.uri.toString();
        const allTabs = vscode.window.tabGroups.all.flatMap((group) => group.tabs);
        const activeTab = allTabs.find((tab) => {
            if (!(tab.input instanceof vscode.TabInputText)) { return false; }
            return tab.input.uri.toString() === uri;
        });

        tabTracker.onTabFocused({ uri, isPinned: activeTab?.isPinned ?? false });
		updateStatusBar(statusBarItem, maxTabs);
    });

    const tabChangeListener = vscode.window.tabGroups.onDidChangeTabs((e) => {
        const allTabs = vscode.window.tabGroups.all.flatMap((group) => group.tabs);

        if (allTabs.length > maxTabs) {
            const oldestUri = tabTracker.getOldestTab();
            if (!oldestUri) { return; }

            const tabToClose = allTabs.find((tab) => {
                if (!(tab.input instanceof vscode.TabInputText)) { return false; }
                return tab.input.uri.toString() === oldestUri;
            });

            if (tabToClose) {
                vscode.window.tabGroups.close(tabToClose);
            }
        }

        e.closed.forEach((tab) => {
            if (!(tab.input instanceof vscode.TabInputText)) { return; }
            tabTracker.onTabClosed({ uri: tab.input.uri.toString(), isPinned: tab.isPinned });
        });

        e.changed.forEach((tab) => {
            if (!(tab.input instanceof vscode.TabInputText)) { return; }
            tabTracker.onTabChanged({ uri: tab.input.uri.toString(), isPinned: tab.isPinned });
        });

		updateStatusBar(statusBarItem, maxTabs);
    });


    context.subscriptions.push(
        helloWorldCommand,
        activeEditorListener,
        tabChangeListener,
        configListener,
		statusBarItem,
    );
}

export function deactivate() {}
