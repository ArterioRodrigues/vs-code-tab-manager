
# Tab Manager Pro

A VS Code extension that keeps your editor clean by enforcing a maximum number of open tabs per group and automatically closing the least recently used ones.

---

## Features

### Automatic Tab Limiting
Set a maximum number of open tabs per editor group. When you open a new tab that exceeds the limit, the oldest (least recently used) tab is automatically closed — no manual cleanup needed.

### Per-Group Enforcement
The limit applies independently to each editor group. If you have a split editor layout, each side maintains its own tab count.

### Most Recently Used (MRU) Ordering
Tabs are tracked by recency. The tab you used least recently is always the one that gets closed — your active work stays open.

### Pinned Tab Protection
Pinned tabs are never auto-closed, regardless of the limit. Pin any file you want to keep permanently open.

### Live Status Bar Counter
A status bar item shows your current tab count per group at a glance:

```
[ 2, 3 | max: 5 ]
```

Left side shows tab counts per group (comma-separated). Right side shows your configured max.

### Configurable Limit
Change your max tab count anytime in VS Code settings — takes effect immediately without restarting.

---

## Extension Settings

This extension contributes the following settings:

| Setting | Type | Default | Description |
|---|---|---|---|
| `tabManager.maxTabs` | `number` | `3` | Maximum number of tabs allowed open per editor group |

### How to configure

Open your VS Code settings (`Ctrl+,` / `Cmd+,`) and search for **Tab Manager**, or add it directly to your `settings.json`:

```json
{
  "tabManager.maxTabs": 5
}
```

---

## How It Works

1. Open a new file — it gets tracked as the most recently used tab in its group.
2. Switch between tabs — the MRU order updates automatically.
3. If the tab count in any group exceeds `maxTabs`, the least recently used tab in that group is closed automatically.
4. Pinned tabs are exempt from auto-closing.
5. The status bar updates in real time to reflect the current state of each group.

---

## Tips

- **Pin files you always want open** (right-click a tab → Pin) — they'll never be auto-closed.
- **Use split editor groups** for different contexts (e.g. source vs. tests). Each group gets its own limit.
- **Set a lower limit** (e.g. `2` or `3`) if you want to stay really focused.

---

## Known Issues

- Non-text tabs (diff editors, settings UI, extension pages) are not tracked in the MRU stack and will not be auto-closed.
- If all tabs in a group are pinned and the limit is exceeded, no tab will be closed.

---

## Release Notes

### 0.0.1

Initial release — MRU tab tracking, per-group enforcement, pinned tab exemption, status bar indicator, and configurable max tab limit.