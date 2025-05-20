export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const

export enum SwapMethod {
  PROXY_SWAP = '0xdad12b6c',
  PROXY_SWAP_V2 = '0xe5e8894b',
  CALL_ONEINCH = '0xa03de6a9',
  CALL_RANGO = '0xdadb693f',
}

export const PROXY_SWAP_ABI = [
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
] as const

export const PROXY_SWAP_V2_ABI = [
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
] as const

export const CALL_ONEINCH_ABI = [
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
] as const

export const CALL_RANGO_ABI = [
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
] as const

export const SWAP_EXACT_IN_ABI = [
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
] as const

export const SWAP_ABI = [
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
] as const
