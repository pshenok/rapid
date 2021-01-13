import fs from 'fs';
import dedent from 'dedent';

export function createEditorConfig(path: string): void {
	fs.writeFileSync(`${path}/.editorconfig`, dedent`
	# EditorConfig is awesome: https://EditorConfig.org

	# top-most EditorConfig file
	root = true

	# Unix-style newlines with a newline ending every file
	[*]
	charset = utf-8
	end_of_line = lf


	[*.{js,ts}]
	indent_style = tab
	tab_width = 2
	trim_trailing_whitespace = true
	insert_final_newline = true

	max_line_length = 150


	[*.{json,yml,yaml}]
	indent_style = space
	indent_size = 2
	`)
}