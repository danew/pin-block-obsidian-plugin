import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';

export default class PinBlockPlugin extends Plugin {
	async onload() {
        this.addCommand({
            id: 'pin-block',
            name: 'Pin current block',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const cursorPosition = editor.getCursor();
                const currentLine = editor.getLine(cursorPosition.line);
                const currentBlock = this.getCurrentBlock(editor, cursorPosition.line);
                
                if (currentBlock) {
                    this.pinBlockToTop(editor, currentBlock);
                } else {
                    new Notice('No block found at cursor position');
                }
            }
        });
    }

    getCurrentBlock(editor: Editor, startLine: number): string | null {
        let block = '';
        let line = startLine;

        while (line >= 0 && line < editor.lineCount()) {
            const currentLine = editor.getLine(line);
            if (currentLine.trim() === '') break;
            block = currentLine + '\n' + block;
            line--;
        }

        line = startLine + 1;
        while (line < editor.lineCount()) {
            const currentLine = editor.getLine(line);
            if (currentLine.trim() === '') break;
            block += currentLine + '\n';
            line++;
        }

        return block.trim() || null;
    }

    pinBlockToTop(editor: Editor, block: string) {
        const currentContent = editor.getValue();
        const updatedContent = block + '\n\n' + currentContent.replace(block, '').trim();
        editor.setValue(updatedContent);
        new Notice('Block pinned to top');
    }

    onunload() {
        // Clean up plugin resources if needed
    }
}
