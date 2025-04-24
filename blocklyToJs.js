function blocklyToJs(json) {
  const blockHandlers = {
    '当开始运行': (block) => {
      const next = block.next;
      if (next) {
        return `当开始运行(() => {\n${indent(processBlock(next))}\n});`;
      }
      return '当开始运行(() => {});';
    },
    '永远循环': (block) => {
      const statements = block.statements?.DO;
      if (statements) {
        return `永远循环(() => {\n${indent(processBlock(statements))}\n});`;
      }
      return '永远循环(() => {});';
    },
    '如果': (block) => {
      const condition = processInput(block.inputs.IF0);
      const doBlock = block.statements?.DO0;
      const elseBlock = block.statements?.ELSE;
      
      let result = `if (${condition}) {`;
      if (doBlock) {
        result += `\n${indent(processBlock(doBlock))}`;
      }
      if (elseBlock) {
        result += `\n} else {\n${indent(processBlock(elseBlock))}\n}`;
      } else {
        result += '\n}';
      }
      return result;
    },
    '判断角色碰撞': (block) => {
      const sprite = block.fields.sprite;
      const sprite1 = block.fields.sprite1;
      return `判断角色碰撞("${sprite}", "${sprite1}")`;
    },
    '移动步数': (block) => {
      const steps = processInput(block.inputs.steps);
      return `移动步数(${steps});`;
    },
    '移到位置': (block) => {
      const x = processInput(block.inputs.x);
      const y = processInput(block.inputs.y);
      return `移到位置(${x}, ${y});`;
    },
    'math_number': (block) => {
      return block.fields.NUM;
    }
  };

  function indent(code) {
    return code.split('\n').map(line => `  ${line}`).join('\n');
  }

  function processInput(input) {
    if (!input) return '';
    if (input.is_output) {
      return processBlock(input);
    }
    return input.fields?.NUM || '';
  }

  function processBlock(block) {
    if (!block || !block.type) return '';
    const handler = blockHandlers[block.type];
    if (handler) {
      return handler(block);
    }
    return '';
  }

  return processBlock(json);
}

// 测试代码
const testJson = {
  "type": "当开始运行",
  "next": {
    "type": "永远循环",
    "statements": {
      "DO": {
        "type": "如果",
        "inputs": {
          "IF0": {
            "type": "判断角色碰撞",
            "fields": {
              "sprite": "自己",
              "sprite1": "鼠标"
            },
            "is_output": true
          }
        },
        "statements": {
          "DO0": {
            "type": "移动步数",
            "inputs": {
              "steps": {
                "type": "math_number",
                "fields": {
                  "NUM": 10
                },
                "is_output": true
              }
            }
          },
          "ELSE": {
            "type": "移到位置",
            "inputs": {
              "x": {
                "type": "math_number",
                "fields": {
                  "NUM": 0
                },
                "is_output": true
              },
              "y": {
                "type": "math_number",
                "fields": {
                  "NUM": -100
                },
                "is_output": true
              }
            }
          }
        }
      }
    }
  }
};

const output = blocklyToJs(testJson);
console.log(output);