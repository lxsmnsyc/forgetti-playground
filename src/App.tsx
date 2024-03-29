import { javascript } from '@codemirror/lang-javascript';
import { EditorView, basicSetup } from 'codemirror';
import type { JSX } from 'solid-js';
import { compile } from './compile';
import example from './example.js?raw';
import { GithubIcon } from './icons';

export default function App(): JSX.Element {
  const input = $signal<HTMLElement>();
  const output = $signal<HTMLElement>();
  const button = $signal<HTMLElement>();

  $effect(() => {
    if (input && output && button) {
      const inputView = new EditorView({
        doc: example,
        extensions: [
          basicSetup,
          javascript({
            jsx: true,
            typescript: false,
          }),
        ],
        parent: input,
      });
      const outputView = new EditorView({
        extensions: [
          basicSetup,
          javascript({
            jsx: true,
            typescript: false,
          }),
        ],
        parent: output,
      });

      const clear = (): void => {
        // Create a transaction to modify the document
        const transaction = outputView.state.update({
          changes: {
            from: 0,
            to: outputView.state.doc.length, // line number
            insert: '', // text to insert
          },
        });

        outputView.dispatch(transaction);
      };

      const insertLine = (lineNumber: number, text: string): void => {
        // Create a transaction to modify the document
        const transaction = outputView.state.update({
          changes: {
            from: outputView.state.doc.line(lineNumber).from,
            to: outputView.state.doc.line(lineNumber).to, // line number
            insert: `${text}\n`, // text to insert
          },
        });

        outputView.dispatch(transaction);
      };

      const process = (): void => {
        clear();
        insertLine(1, compile(inputView.state.doc.toString()));
      };

      button.addEventListener('click', process);

      $cleanup(() => {
        button.removeEventListener('click', process);
        inputView.destroy();
        outputView.destroy();
      });
    }
  });

  return (
    <div class="flex flex-col gap-4 m-8">
      <div class="flex flex-row gap-1 items-center justify-center">
        <h1 class="text-4xl font-bold">Forgetti</h1>
        <a href="https://github.com/lxsmnsyc/forgetti">
          <GithubIcon class="w-8 h-8 text-black" />
        </a>
      </div>
      <div class="flex flex-col gap-2">
        <button
          class="rounded-md bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-100"
          ref={$set(button)}
        >
          Compile!
        </button>
      </div>
      <div class="w-full h-auto flex flex-row rounded-lg shadow-lg overflow-hidden">
        <div class="flex-1 overflow-auto" ref={$set(input)}></div>
        <div class="flex-1 overflow-auto" ref={$set(output)}></div>
      </div>
    </div>
  );
}
