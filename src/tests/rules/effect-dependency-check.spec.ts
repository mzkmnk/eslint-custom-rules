import {RuleTester} from "@angular-eslint/test-utils";

import {effectDependencyCheck as rule} from '@/rules/effect-dependency-check';

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
      errors: [
        {
          messageId: 'effectDependencyCheck',
          line: 5,
          column: 13,
        }],
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
      errors: [
        {
          messageId: 'effectDependencyCheck',
          line: 5,
          column: 13,
        },
        {
          messageId: 'effectDependencyCheck',
          line: 9,
          column: 13,
        }],
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
      errors: [{
        messageId: 'effectDependencyCheck',
        line: 12,
        column: 13,
      }],
    },
  ],
});