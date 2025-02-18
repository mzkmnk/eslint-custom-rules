import {RuleTester} from "@angular-eslint/test-utils";

import rule from '@/rules/effect-dependency-check';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser')
  }
});

ruleTester.run('effect-dependency-check', rule, {
  valid: [
    {
      code: `
        export class TempleComponent {
          num = signal<number>(0);
          constructor(){
            effect(() =>
              ((num) => {
                // do something
              })(this.num())
            );
          }
        }
      `,
      filename: 'template.component.ts',
    },
  ],
  invalid: [
    {
      code: `
        export class TempleComponent {
          num = signal<number>(0);
          constructor(){
            effect(() => {
              // do something
            })
          }
        }
      `,
      filename: 'template.component.ts',
      errors: [{messageId: 'effectDependencyCheck'}],
    },

    {
      code: `
        export class TempleComponent {
          num = signal<number>(0);
          constructor(){
            effect(() => {
              // do something
            })
            
            effect(() => {
              // do something
            })
          }
        }
      `,
      filename: 'template.component.ts',
      errors: [{messageId: 'effectDependencyCheck'}, {messageId: 'effectDependencyCheck'}],
    },

    {
      code: `
        export class TempleComponent {
          num = signal<number>(0);
          constructor(){
            
            effect(() =>
              ((num) => {
                // do something
              })(this.num())
            );
            
            effect(() => {
              // do something
            })
          }
        }
      `,
      filename: 'template.component.ts',
      errors: [{messageId: 'effectDependencyCheck'}],
    },
  ],
});