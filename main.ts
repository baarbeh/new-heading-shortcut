import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface NewHeadingShortcutSettings {
	defaultHeaderLevel: number;
	addSpaceAfterHash: boolean;
}

const DEFAULT_SETTINGS: NewHeadingShortcutSettings = {
	defaultHeaderLevel: 1,
	addSpaceAfterHash: true
}

export default class NewHeadingShortcutPlugin extends Plugin {
	settings: NewHeadingShortcutSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'add-sibling-header',
			name: 'Add New Contextual Header (Sibling)',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.addSiblingHeader(editor);
			}
		});

		this.addCommand({
			id: 'add-child-header',
			name: 'Add New Contextual Header (Child)',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.addChildHeader(editor);
			}
		});

		this.addCommand({
			id: 'add-parent-header',
			name: 'Add New Contextual Header (Parent)',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.addParentHeader(editor);
			}
		});

		this.addSettingTab(new NewHeadingShortcutSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private findLastHeaderLevel(editor: Editor): number {
		const cursorPosition = editor.getCursor();
		const linesUntilCursor = editor.getValue().split('\n').slice(0, cursorPosition.line + 1);
		const contentUntilCursor = linesUntilCursor.join('\n');

		const headings = contentUntilCursor.match(/^#+ /gm);
		
		if (headings && headings.length > 0) {
			const lastHeading = headings[headings.length - 1];
			return lastHeading.match(/^#+/)[0].length;
		}
		
		return this.settings.defaultHeaderLevel;
	}

	private addSiblingHeader(editor: Editor) {
		const headerLevel = this.findLastHeaderLevel(editor);
		this.insertHeader(editor, headerLevel);
	}

	private addChildHeader(editor: Editor) {
		const headerLevel = this.findLastHeaderLevel(editor);
		const childLevel = Math.min(headerLevel + 1, 6); // Max 6 header levels
		this.insertHeader(editor, childLevel);
	}

	private addParentHeader(editor: Editor) {
		const headerLevel = this.findLastHeaderLevel(editor);
		const parentLevel = Math.max(headerLevel - 1, 1); // Min 1 header level
		this.insertHeader(editor, parentLevel);
	}

	private insertHeader(editor: Editor, level: number) {
		const cursor = editor.getCursor();
		const headerPrefix = '#'.repeat(level);
		const space = this.settings.addSpaceAfterHash ? ' ' : '';
		const newlinePrefix = (cursor.line === 0 && cursor.ch === 0) ? '' : '\n';
		
		const headerText = `${newlinePrefix}${headerPrefix}${space}`;
		
		editor.replaceRange(headerText, cursor);
		
		// Position cursor at the end of the inserted header
		const newCursorPos = {
			line: cursor.line + (newlinePrefix ? 1 : 0),
			ch: headerText.length - (newlinePrefix ? 1 : 0)
		};
		editor.setCursor(newCursorPos);
	}
}

class NewHeadingShortcutSettingTab extends PluginSettingTab {
	plugin: NewHeadingShortcutPlugin;

	constructor(app: App, plugin: NewHeadingShortcutPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	private openHotkeySettings(commandName: string): void {
		// @ts-ignore - accessing private method to open hotkeys tab
		this.app.setting.openTabById('hotkeys');
		// @ts-ignore - accessing private tab object
		const tab = this.app.setting.activeTab;
		if (tab && tab.searchComponent && tab.searchComponent.inputEl) {
			tab.searchComponent.inputEl.value = commandName;
			tab.updateHotkeyVisibility();
		}
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'New Heading Shortcut Settings'});

		// Plugin description
		const descEl = containerEl.createEl('div', {cls: 'setting-item-description'});
		descEl.innerHTML = `
			<p>This plugin intelligently creates headers based on the most recent header in your document. It analyzes your document content up to the cursor position and determines the appropriate header level.</p>
			<ul>
				<li><strong>Sibling Header:</strong> Creates a header at the same level as the most recent header</li>
				<li><strong>Child Header:</strong> Creates a header one level deeper (e.g., ## becomes ###)</li>
				<li><strong>Parent Header:</strong> Creates a header one level higher (e.g., ### becomes ##)</li>
			</ul>
		`;
		descEl.style.marginBottom = '20px';
		descEl.style.padding = '10px';
		descEl.style.backgroundColor = 'var(--background-secondary)';
		descEl.style.borderRadius = '5px';

		// Hotkeys section
		containerEl.createEl('h3', {text: 'Hotkey Configuration'});
		
		const hotkeyDesc = containerEl.createEl('p');
		hotkeyDesc.textContent = 'Configure hotkeys for quick access to each command. Click the buttons below to open the hotkey assignment dialog.';
		hotkeyDesc.style.marginBottom = '15px';
		hotkeyDesc.style.color = 'var(--text-muted)';

		// Sibling header hotkey
		new Setting(containerEl)
			.setName('Add Sibling Header')
			.setDesc('Creates a header at the same level as the most recent header')
			.addExtraButton(button => button
				.setIcon('any-key')
				.setTooltip('Configure Hotkey')
				.onClick(() => {
					this.openHotkeySettings('Add New Contextual Header (Sibling)');
				}));

		// Child header hotkey
		new Setting(containerEl)
			.setName('Add Child Header')
			.setDesc('Creates a header one level deeper than the most recent header')
			.addExtraButton(button => button
				.setIcon('any-key')
				.setTooltip('Configure Hotkey')
				.onClick(() => {
					this.openHotkeySettings('Add New Contextual Header (Child)');
				}));

		// Parent header hotkey
		new Setting(containerEl)
			.setName('Add Parent Header')
			.setDesc('Creates a header one level higher than the most recent header')
			.addExtraButton(button => button
				.setIcon('any-key')
				.setTooltip('Configure Hotkey')
				.onClick(() => {
					this.openHotkeySettings('Add New Contextual Header (Parent)');
				}));

		// General settings section
		containerEl.createEl('h3', {text: 'General Settings'});

		new Setting(containerEl)
			.setName('Default header level')
			.setDesc('The header level to use when no previous headers are found in the document')
			.addSlider(slider => slider
				.setLimits(1, 6, 1)
				.setValue(this.plugin.settings.defaultHeaderLevel)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.defaultHeaderLevel = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Add space after hash')
			.setDesc('Add a space after the # symbols in the header')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.addSpaceAfterHash)
				.onChange(async (value) => {
					this.plugin.settings.addSpaceAfterHash = value;
					await this.plugin.saveSettings();
				}));
	}
}