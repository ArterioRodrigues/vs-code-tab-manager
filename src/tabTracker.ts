export type TabTrackerProperties = {
    uri: string,
    isPinned: boolean
}

export class TabTracker {
    private _tabs: Array<TabTrackerProperties>;

    constructor() {
        this._tabs = [];
    }

    onTabFocused(props: TabTrackerProperties) {
        this._tabs = this._tabs.filter(_props=> _props.uri !== props.uri);
        this._tabs.unshift(props);
        console.log(this._tabs);
    }
    onTabClosed(props: TabTrackerProperties) {
        this._tabs = this._tabs.filter(_props=> _props.uri !== props.uri);
    }

    getOldestTab() {
        const tab = [...this._tabs].reverse().find(props => !props.isPinned);
        return tab?.uri;
    }

    onTabChanged(props: TabTrackerProperties) {
        const tab = this._tabs.find(t => t.uri === props.uri);
        if (!tab) { return; }
        tab.isPinned = props.isPinned;
    }
}
