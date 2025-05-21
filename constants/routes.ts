export const SWAP_ROUTES = [
  {
    method: '0xdad12b6c',
    amountPath: [2],
    callDataPath: [4],
    abi: [
      {
        name: 'proxySwap',
        type: 'function',
        inputs: [
          { name: 'router', type: 'address' },
          { name: 'fromTokenWithFee', type: 'uint256' },
          { name: 'fromAmt', type: 'uint256' },
          { name: 'toTokenWithFee', type: 'uint256' },
          { name: 'callData', type: 'bytes' },
        ],
      },
    ],
  },
  {
    method: '0xe5e8894b',
    amountPath: [2],
    callDataPath: [5],
    abi: [
      {
        name: 'proxySwapV2',
        type: 'function',
        inputs: [
          { name: 'router', type: 'address' },
          { name: 'fromTokenWithFee', type: 'uint256' },
          { name: 'fromAmt', type: 'uint256' },
          { name: 'toTokenWithFee', type: 'uint256' },
          { name: 'minReturnAmt', type: 'uint256' },
          { name: 'callData', type: 'bytes' },
        ],
      },
    ],
  },
  {
    method: '0xa03de6a9',
    amountPath: [1],
    callDataPath: [3],
    abi: [
      {
        inputs: [
          { internalType: 'uint256', name: 'fromTokenWithFee', type: 'uint256' },
          { internalType: 'uint256', name: 'fromAmt', type: 'uint256' },
          { internalType: 'uint256', name: 'toTokenWithFee', type: 'uint256' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
        ],
        name: 'callOneInch',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
  },
  {
    method: '0xdadb693f',
    amountPath: [1],
    callDataPath: [3],
    abi: [
      {
        inputs: [
          { internalType: 'uint256', name: 'fromTokenWithFee', type: 'uint256' },
          { internalType: 'uint256', name: 'fromAmt', type: 'uint256' },
          { internalType: 'uint256', name: 'toTokenWithFee', type: 'uint256' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
        ],
        name: 'callRango',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
  },
  {
    method: '0x849ce572',
    amountPath: [1],
    callDataPath: [3],
    abi: [
      {
        inputs: [
          { internalType: 'uint256', name: 'fromTokenWithFee', type: 'uint256' },
          { internalType: 'uint256', name: 'fromAmt', type: 'uint256' },
          { internalType: 'uint256', name: 'toTokenWithFee', type: 'uint256' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
        ],
        name: 'callLiFi',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
  },
  {
    method: '0x3166c37c',
    amountPath: [1],
    callDataPath: [3],
    abi: [
      {
        inputs: [
          { internalType: 'uint256', name: 'fromTokenWithFee', type: 'uint256' },
          { internalType: 'uint256', name: 'fromAmt', type: 'uint256' },
          { internalType: 'uint256', name: 'toTokenWithFee', type: 'uint256' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
        ],
        name: 'callQuant',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
  },
]

export const INNER_SWAP_ROUTES = [
  {
    method: '0x9aa90356',
    fromTokenPath: [1, 'inputToken'],
    toTokenPath: [1, 'outputToken'],
    abi: [
      {
        inputs: [
          { internalType: 'uint256', name: 'orderId', type: 'uint256' },
          {
            components: [
              { internalType: 'address', name: 'inputToken', type: 'address' },
              { internalType: 'address', name: 'outputToken', type: 'address' },
              { internalType: 'uint256', name: 'minOutputAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'deadline', type: 'uint256' },
            ],
            internalType: 'struct IAggregator.BaseExactInRequest',
            name: 'request',
            type: 'tuple',
          },
          { internalType: 'uint256[]', name: 'routesAmount', type: 'uint256[]' },
          {
            components: [
              { internalType: 'uint256[]', name: 'mixAdapters', type: 'uint256[]' },
              { internalType: 'address[]', name: 'assetTo', type: 'address[]' },
              { internalType: 'uint256[]', name: 'rawData', type: 'uint256[]' },
              { internalType: 'bytes[]', name: 'extraData', type: 'bytes[]' },
              { internalType: 'address', name: 'fromToken', type: 'address' },
            ],
            internalType: 'struct IAggregator.RouterPath[][]',
            name: 'routes',
            type: 'tuple[][]',
          },
          { internalType: 'uint256', name: 'feeConfig', type: 'uint256' },
        ],
        name: 'swapExactIn',
        outputs: [{ internalType: 'uint256', name: 'outputAmtReceived', type: 'uint256' }],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
  },
  {
    method: '0x07ed2379',
    fromTokenPath: [1, 'srcToken'],
    toTokenPath: [1, 'dstToken'],
    abi: [
      {
        inputs: [
          { internalType: 'contract IAggregationExecutor', name: 'executor', type: 'address' },
          {
            components: [
              { internalType: 'contract IERC20', name: 'srcToken', type: 'address' },
              { internalType: 'contract IERC20', name: 'dstToken', type: 'address' },
              { internalType: 'address payable', name: 'srcReceiver', type: 'address' },
              { internalType: 'address payable', name: 'dstReceiver', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'uint256', name: 'minReturnAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'flags', type: 'uint256' },
            ],
            internalType: 'struct GenericRouter.SwapDescription',
            name: 'desc',
            type: 'tuple',
          },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        name: 'swap',
        outputs: [
          { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'spentAmount', type: 'uint256' },
        ],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
  },
  {
    method: '0xb80c2f09',
    fromTokenPath: [1, 'fromToken'],
    toTokenPath: [1, 'toToken'],
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'fromToken',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'toToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'fromTokenAmount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'minReturnAmount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'deadLine',
                type: 'uint256',
              },
            ],
            internalType: 'struct DexRouter.BaseRequest',
            name: 'baseRequest',
            type: 'tuple',
          },
          {
            internalType: 'uint256[]',
            name: 'batchesAmount',
            type: 'uint256[]',
          },
          {
            components: [
              {
                internalType: 'address[]',
                name: 'mixAdapters',
                type: 'address[]',
              },
              {
                internalType: 'address[]',
                name: 'assetTo',
                type: 'address[]',
              },
              {
                internalType: 'uint256[]',
                name: 'rawData',
                type: 'uint256[]',
              },
              {
                internalType: 'bytes[]',
                name: 'extraData',
                type: 'bytes[]',
              },
              {
                internalType: 'uint256',
                name: 'fromToken',
                type: 'uint256',
              },
            ],
            internalType: 'struct DexRouter.RouterPath[][]',
            name: 'batches',
            type: 'tuple[][]',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'pathIndex',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'payer',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'fromToken',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'toToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'fromTokenAmountMax',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'toTokenAmountMax',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'salt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'deadLine',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isPushOrder',
                type: 'bool',
              },
              {
                internalType: 'bytes',
                name: 'extension',
                type: 'bytes',
              },
            ],
            internalType: 'struct PMMLib.PMMSwapRequest[]',
            name: 'extraData',
            type: 'tuple[]',
          },
        ],
        name: 'smartSwapByOrderId',
        outputs: [
          {
            internalType: 'uint256',
            name: 'returnAmount',
            type: 'uint256',
          },
        ],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
  },
]
