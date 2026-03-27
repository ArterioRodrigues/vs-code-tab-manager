import * as vscode from 'vscode';

function updateStatusBar(statusBarItem: vscode.StatusBarItem, maxTabs: number) {
    const groups = vscode.window.tabGroups.all;
    const groupCounts = groups.map(g => g.tabs.length).join(', ');
    statusBarItem.text = `[ ${groupCounts} | max: ${maxTabs} ]`;
}

export function activate(context: vscode.ExtensionContext) {
    let maxTabs: number = vscode.workspace.getConfiguration('tabManager').get('maxTabs') ?? 5;

    const helloWorldCommand = vscode.commands.registerCommand('tab-manager.tabManager', () => {});

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    updateStatusBar(statusBarItem, maxTabs);
    statusBarItem.show();

    const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('tabManager.maxTabs'))
            {maxTabs = vscode.workspace.getConfiguration('tabManager').get('maxTabs') ?? 5;}
        updateStatusBar(statusBarItem, maxTabs);
    });

    const activeEditorListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (!editor) { return; }

        const uri = editor.document.uri.toString();

        for (const group of vscode.window.tabGroups.all) {
            const indexInGroup = group.tabs.findIndex((tab) => {
                if (!(tab.input instanceof vscode.TabInputText)) { return false; }
                return tab.input.uri.toString() === uri;
            });

            if (indexInGroup !== -1) {
                for (let i = 0; i < indexInGroup; i++) 
                    {vscode.commands.executeCommand('workbench.action.moveEditorLeftInGroup');}
                break;
            }
        }

        updateStatusBar(statusBarItem, maxTabs);
    });

    const tabChangeListener = vscode.window.tabGroups.onDidChangeTabs((e) => {
        for (const group of vscode.window.tabGroups.all) {
            if (group.tabs.length > maxTabs) {
                const tabToClose = group.tabs[group.tabs.length - 1];
                if (tabToClose)
                    {vscode.window.tabGroups.close(tabToClose);}
            }
        }

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