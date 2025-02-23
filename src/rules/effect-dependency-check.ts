import {TSESLint} from "@typescript-eslint/utils";

/**
 * @description
 * This rule enforces that dependencies within Angular Effects are declared explicitly.
 *
 * // NG
 * ```ts
 * export class EffectComponent {
 *   num = signal<number>(0);
 *   effect(() => {
 *    console.log(this.num());
 *   });
 * }
 * ```
 *
 * // OK
 * ```ts
 * export class EffectComponent {
 *  num = signal<number>(0);
 *  effect(() => ((num) => {
 *    console.log(num)
 *  })(this.num()));
 * }
 * ```
 */
export const effectDependencyCheck: TSESLint.RuleModule<'effectDependencyCheck', []> = {
  meta: {
    messages: {
      effectDependencyCheck: 'Effect dependencies must be declared explicitly',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    return {
      MethodDefinition(node) {
        if (node.kind === 'constructor') {
          // FunctionExpression
          const funcExp = node.value;

          if (funcExp.body === null) {
            return
          }

          // BlockStatement
          const statements = funcExp.body

          statements.body.forEach(statement => {
            if (statement.type !== 'ExpressionStatement') {
              return
            }


            // ExpressionStatement
            const expression = statement.expression;

            if (expression.type !== 'CallExpression') {
              return
            }

            // CallExpression
            if (expression.callee.type !== 'Identifier' || expression.callee.name !== 'effect') {
              return
            }

            const errorNode = expression;

            expression.arguments.forEach(arg => {
              if (arg.type !== 'ArrowFunctionExpression') {
                return
              }

              // ArrowFunctionExpression
              if (arg.body.type !== 'CallExpression') {
                context.report({
                  node: errorNode,
                  messageId: 'effectDependencyCheck',
                })
                return;
              }

              // CallExpression
              arg.body.arguments.forEach(callExpArg => {
                if (callExpArg.type !== 'CallExpression') {
                  console.log('callExpArg', callExpArg)
                  context.report({
                    node: errorNode,
                    messageId: 'effectDependencyCheck',
                  })
                }
              })
            })
          });
        }
      },
    }
  }
};