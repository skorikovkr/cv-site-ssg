export const functions = {
  function000002: {
    id: 'function000002',
    name: 'someCustomFunc2',
    inputTypes: ['vec2'],
    inputsNames: ['someArg'],
    output: 'vec4',
    nodes: {
      root: {
        id: 'root',
        type: 'function-return',
        dataType: 'vec4',
        inputTypes: ['vec4'],
        inputs: [null],
      },
    },
  },

  function000001: {
    id: 'function000001',
    name: 'someCustomFunc',
    inputTypes: ['float'],
    inputsNames: ['someArg'],
    output: 'vec3',
    nodes: {
      root: {
        id: 'root',
        type: 'function-return',
        dataType: 'vec3',
        inputTypes: ['vec3'],
        inputs: ['add123456'],
      },
      uniform000001: {
        id: 'uniform000001',
        type: 'uniform',
        dataType: 'float',
        options: {
          uniformName: 'u_time',
        },
      },
      add123456: {
        id: 'add123456',
        type: 'add',
        dataType: 'vec3',
        inputTypes: ['float', 'vec3'],
        inputs: ['uniform000001', 'arg000001'],
      },
      a000001: {
        id: 'a000001',
        type: 'value',
        dataType: 'vec3',
        options: {
          value: 'vec3(1.,2.,3.)',
        },
      },
      arg000001: {
        id: 'arg000001',
        type: 'function-arg',
        dataType: 'float',
        options: {
          name: 'someArg',
        },
      },
    },
  },
  main: {
    id: 'main',
    name: 'main',
    inputTypes: [],
    inputsNames: [],
    output: 'void',
    nodes: {
      root: {
        type: 'function-return',
        id: 'root',
        inputTypes: ['vec4'],
        inputs: ['vec4000001'],
      },
      value000005: {
        type: 'value',
        dataType: 'float',
        id: 'value000005',
        options: {
          value: '100.0',
        },
      },
      divide000001: {
        type: 'divide',
        dataType: 'float',
        id: 'divide000001',
        inputTypes: ['float', 'float'],
        inputs: ['const000009', 'multiply000003'],
      },
      const000009: {
        type: 'const',
        id: 'const000009',
        dataType: 'float',
        inputTypes: ['float'],
        inputs: ['value000006'],
      },
      value000006: {
        type: 'value',
        id: 'value000006',
        dataType: 'float',
        options: {
          value: '20.',
        },
      },
      subtract000001: {
        type: 'subtract',
        dataType: 'float',
        id: 'subtract000001',
        inputTypes: ['float', 'float'],
        inputs: ['uniform000001', 'divide000001'],
      },
      multiply000003: {
        type: 'multiply',
        dataType: 'float',
        id: 'multiply000003',
        inputTypes: ['float', 'float'],
        inputs: ['value000004', 'extractor000001'],
      },
      value000004: {
        type: 'value',
        dataType: 'float',
        id: 'value000004',
        options: {
          value: '23.5',
        },
      },
      uniform000001: {
        id: 'uniform000001',
        type: 'uniform',
        dataType: 'float',
        options: {
          uniformName: 'u_time',
        },
      },
      value_vec2: {
        id: 'value_vec2',
        type: 'value',
        dataType: 'vec2',
        options: {
          value: 'vec2(1.,2.)',
        },
      },
      extractor000001: {
        id: 'extractor000001',
        type: 'extractor',
        dataType: 'float',
        inputTypes: ['vec2'],
        inputs: ['value_vec2'],
        options: {
          propertyName: 'x',
        },
      },
      value12345: {
        id: 'value12345',
        type: 'value',
        dataType: 'float',
        options: {
          value: '1.0',
        },
      },
      vec4000001: {
        id: 'vec4000001',
        type: 'vec4',
        dataType: 'vec4',
        inputTypes: ['float', 'float', 'float', 'float'],
        inputs: ['subtract000001', null, 'subtract000001', 'value12345'],
      },
      func0000123: {
        id: 'func0000123',
        type: 'function-invoke',
        inputTypes: ['float'],
        dataType: 'vec3',
        inputs: [null],
        options: {
          id: 'function000001',
        },
      },
    },
  },
}

export const coords = {
  main: {
    nodes: {
      func0000123: {
        x: 50,
        y: 50,
      },
      root: {
        x: 883,
        y: 145,
      },
      value000005: {
        x: 683,
        y: 339,
      },
      divide000001: {
        x: 557,
        y: 236,
      },
      const000009: {
        x: 413,
        y: 166,
      },
      value000006: {
        x: 271,
        y: 164,
      },
      subtract000001: {
        x: 686,
        y: 133,
      },
      multiply000003: {
        x: 410,
        y: 296,
      },
      value000004: {
        x: 227,
        y: 278,
      },
      uniform000001: {
        x: 554,
        y: 41,
      },
      value_vec2: {
        x: 55,
        y: 283,
      },
      extractor000001: {
        x: 224,
        y: 390,
      },
      value12345: {
        x: 65,
        y: 383,
      },
      vec4000001: {
        x: 324,
        y: 490,
      },
    },
  },
  function000001: {
    nodes: {},
  },
  function000002: {
    nodes: {},
  },
}
