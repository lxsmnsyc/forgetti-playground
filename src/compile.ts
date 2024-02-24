import * as babel from '@babel/standalone';
import forgettiPlugin from 'forgetti';

babel.registerPlugin('forgetti', forgettiPlugin);

export function compile(code: string): string {
  const plugins: babel.ParserOptions['plugins'] = [
    'jsx',
    // import { example } from 'example' with { example: true };
    'importAttributes',
    // () => throw example
    'throwExpressions',
    // You know what this is
    'decorators',
    // const { #example: example } = this;
    'destructuringPrivate',
    // using example = myExample()
    'explicitResourceManagement',
  ];

  const result = babel.transform(code, {
    plugins: [['forgetti', { preset: 'react' }]],
    parserOpts: {
      plugins,
    },
    ast: false,
    configFile: false,
    babelrc: false,
  });

  return result?.code || '';
}
