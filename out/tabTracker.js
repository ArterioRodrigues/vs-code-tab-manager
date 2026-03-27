"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabTracker = void 0;
class TabTracker {
    _tabs;
    constructor() {
        this._tabs = [];
    }
    onTabFocused(props) {
        this._tabs = this._tabs.filter(_props => _props.uri !== props.uri);
        this._tabs.unshift(props);
        console.log(this._tabs);
    }
    onTabClosed(props) {
        this._tabs = this._tabs.filter(_props => _props.uri !== props.uri);
    }
    getOldestTab() {
        const tab = [...this._tabs].reverse().find(props => !props.isPinned);
        return tab?.uri;
    }
    onTabChanged(props) {
        const tab = this._tabs.find(t => t.uri === props.uri);
        if (!tab) {
            return;
        }
        tab.isPinned = props.isPinned;
    }
}
exports.TabTracker = TabTracker;
//# sourceMappingURL=tabTracker.js.map