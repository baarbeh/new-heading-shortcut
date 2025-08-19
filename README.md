# New Heading Shortcut

An Obsidian plugin that intelligently inserts contextual headers based on the most recent header in your document.

## Features

This plugin provides three commands to streamline header creation in your markdown documents:

### 🔄 Add New Contextual Header (Sibling)
Creates a header at the same level as the most recent header in your document.

**Example:**
```markdown
# Main Topic
Some content here...
## Subtopic
More content here...
[cursor position]
```
→ Creates: `## ` (same level as the last header)

### ⬇️ Add New Contextual Header (Child) 
Creates a header one level deeper than the most recent header.

**Example:**
```markdown
# Main Topic
Some content here...
## Subtopic
More content here...
[cursor position]
```
→ Creates: `### ` (one level deeper)

### ⬆️ Add New Contextual Header (Parent)
Creates a header one level higher than the most recent header.

**Example:**
```markdown
# Main Topic
Some content here...
## Subtopic
More content here...
[cursor position]
```
→ Creates: `# ` (one level higher)

## Installation

### From Community Plugins (Recommended)
1. Open Obsidian Settings
2. Go to Community plugins and disable Safe mode
3. Click Browse and search for "New Heading Shortcut"
4. Install and enable the plugin

### Manual Installation
1. Download the latest release from the GitHub releases page
2. Extract the files to your vault's `.obsidian/plugins/new-heading-shortcut/` folder
3. Reload Obsidian and enable the plugin in Settings

## Usage

### Command Palette
1. Open the Command Palette (`Cmd/Ctrl + P`)
2. Type "Add New Contextual Header" to see the three available commands:
   - Add New Contextual Header (Sibling)
   - Add New Contextual Header (Child)
   - Add New Contextual Header (Parent)

### Hotkeys (Recommended)
For the best experience, assign hotkeys to these commands:

1. Go to Settings → Hotkeys
2. Search for "Add New Contextual Header"
3. Assign your preferred key combinations, for example:
   - `Ctrl/Cmd + Shift + H` for Sibling
   - `Ctrl/Cmd + Shift + J` for Child
   - `Ctrl/Cmd + Shift + K` for Parent

## Settings

Access plugin settings through Settings → Plugin Options → New Heading Shortcut:

- **Default header level** (1-6): The header level to use when no previous headers exist in the document
- **Add space after hash**: Toggle whether to include a space after the `#` symbols (recommended: enabled)

## Behavior Notes

- The plugin analyzes your document from the beginning up to your current cursor position
- If no headers are found, it uses the default header level from settings
- Header levels are limited to 1-6 (standard markdown range)
- Child headers won't exceed level 6
- Parent headers won't go below level 1

## Troubleshooting

### Headers not detected correctly
- Ensure headers follow standard markdown format: `# Header` with space after `#`
- Headers without spaces after `#` won't be detected

### Plugin not working
- Verify the plugin is enabled in Settings → Community plugins
- Check if you're in a markdown file (`.md` extension)
- Try reloading Obsidian

## Development

This plugin is built with TypeScript and uses the Obsidian Plugin API.

### Building from source
```bash
npm install
npm run build
```

### Development mode
```bash
npm run dev
```

## Support

If you encounter issues or have suggestions:
- Check the [GitHub Issues](https://github.com/baarbeh/new-heading-shortcut/issues) page
- Create a new issue with detailed information about your problem

### ☕ Buy Me a Coffee

If this plugin helps improve your workflow, consider supporting its development:

<a href="https://www.buymeacoffee.com/baarbeh" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

Your support helps maintain and improve this plugin!

## License

MIT License - see LICENSE file for details.

---

**Enjoy more efficient header management in your Obsidian notes!** 📝