import {TSESLint} from "@typescript-eslint/utils";

type Scheme = {
  elements: string[];
}

/**
 * @description
 * このルールはangularのeffectが依存関係を明示させることを強制します。
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
export const effectDependencyCheck: TSESLint.RuleModule<'effectDependencyCheck', [Scheme]> = {
  meta: {
    messages: {
      effectDependencyCheck: 'effect should not have a dependency on another effect',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [{elements: []}],
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

            expression.arguments.forEach(arg => {
              if (arg.type !== 'ArrowFunctionExpression') {
                return
              }

              // ArrowFunctionExpression
              if (arg.body.type !== 'CallExpression') {
                context.report({
                  node: node,
                  messageId: 'effectDependencyCheck',
                })
                return;
              }

              // CallExpression
              arg.body.arguments.forEach(callExpArg => {
                if (callExpArg.type !== 'CallExpression') {
                  console.log('callExpArg', callExpArg)
                  context.report({
                    node: node,
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