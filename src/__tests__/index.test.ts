import { Linter } from "eslint";
import stripIndent from 'strip-indent';
import { rebase, rebaseFile } from "../rebase";

const eslintConfig = {
    parserOptions: {
        ecmaVersion: 2017
    },
    env: {
        es6: true
    },
    rules: {
        'no-console': 'error'
    },
    plugins: [
        'rebase'
    ]
    // TODO: Remove type assertion. Why doesn't it like my ESLint config?
  // @ts-ignore
} as Linter.Config;

describe('rebaseFile', () => {
    it('should work', () => {
        const code = stripIndent(`
          function f () {}
        
          const a = 'a';
          
          console.log('ok');
          
          const b = 'b';
          
          const r = f();
        `);

        expect(rebaseFile({
           file: {
               filename: 'foo.js',
               code,
           },
            eslintConfig,
        })).toMatchObject({
            'console.log(\'ok\');': true
        })
    })
});

describe('rebase', () => {
    it('should work', () => {
        const code = stripIndent(`
          function f () {}
        
          const a = 'a';
          
          console.log('ok');
          
          const b = 'b';
          
          const r = f();
        `);

        expect(rebase({
            files: [
                {
                    filename: 'foo.js',
                    code
                }
            ],
            eslintConfig,
        })).toMatchObject({
            'foo.js::console.log(\'ok\');': true
        })
    })
});
