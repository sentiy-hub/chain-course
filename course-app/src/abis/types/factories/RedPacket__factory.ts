/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { RedPacket, RedPacketInterface } from "../RedPacket";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isEqual",
        type: "bool",
      },
    ],
    name: "DepositMade",
    type: "event",
  },
  {
    inputs: [],
    name: "count",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "c",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isEqual",
        type: "bool",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "grabRedEnvelope",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610be6806100606000396000f3fe608060405260043610610072576000357c01000000000000000000000000000000000000000000000000000000009004806306661abd1461007757806312065fe0146100a25780631a39d8ef146100cd5780638da5cb5b146100f85780639a40832114610123578063ed9d3c0e1461013f575b600080fd5b34801561008357600080fd5b5061008c610149565b60405161009991906105e7565b60405180910390f35b3480156100ae57600080fd5b506100b761014f565b6040516100c491906105e7565b60405180910390f35b3480156100d957600080fd5b506100e261016e565b6040516100ef91906105e7565b60405180910390f35b34801561010457600080fd5b5061010d610174565b60405161011a9190610643565b60405180910390f35b61013d600480360381019061013891906106c7565b610198565b005b610147610259565b005b60025481565b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b60015481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600034116101db576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101d290610764565b60405180910390fd5b8160028190555080600360006101000a81548160ff021916908315150217905550346001819055503373ffffffffffffffffffffffffffffffffffffffff167f3789e6d921364216c21a3c70b27ef84dba205003a0bb9634fa058df58ad9419b34848460405161024d93929190610793565b60405180910390a25050565b60006002541161029e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161029590610816565b60405180910390fd5b6000600154116102e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102da90610882565b60405180910390fd5b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615610370576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610367906108ee565b60405180910390fd5b6001600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600160025403610430573373ffffffffffffffffffffffffffffffffffffffff166108fc6001549081150290604051600060405180830381858888f1935050505015801561041a573d6000803e3d6000fd5b50600060018190555060006002819055506105b4565b600360009054906101000a900460ff16156104bf576000600254600154610457919061096c565b90503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015801561049f573d6000803e3d6000fd5b5080600160008282546104b2919061099d565b92505081905550506105b3565b6000600160083360008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660025460015442604051602001610502959493929190610a81565b60405160208183030381529060405280519060200120600190046105269190610ae0565b6105309190610b11565b90506000600a826001546105449190610b45565b61054e919061096c565b90503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610596573d6000803e3d6000fd5b5080600160008282546105a9919061099d565b9250508190555050505b5b600260008154809291906105c790610b87565b9190505550565b6000819050919050565b6105e1816105ce565b82525050565b60006020820190506105fc60008301846105d8565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061062d82610602565b9050919050565b61063d81610622565b82525050565b60006020820190506106586000830184610634565b92915050565b600080fd5b61066c816105ce565b811461067757600080fd5b50565b60008135905061068981610663565b92915050565b60008115159050919050565b6106a48161068f565b81146106af57600080fd5b50565b6000813590506106c18161069b565b92915050565b600080604083850312156106de576106dd61065e565b5b60006106ec8582860161067a565b92505060206106fd858286016106b2565b9150509250929050565b600082825260208201905092915050565b7f616d6f756e74206d7573743e3000000000000000000000000000000000000000600082015250565b600061074e600d83610707565b915061075982610718565b602082019050919050565b6000602082019050818103600083015261077d81610741565b9050919050565b61078d8161068f565b82525050565b60006060820190506107a860008301866105d8565b6107b560208301856105d8565b6107c26040830184610784565b949350505050565b7f636f756e74206d757374203e3000000000000000000000000000000000000000600082015250565b6000610800600d83610707565b915061080b826107ca565b602082019050919050565b6000602082019050818103600083015261082f816107f3565b9050919050565b7f746f74616c416d6f756e74206d757374203e3000000000000000000000000000600082015250565b600061086c601383610707565b915061087782610836565b602082019050919050565b6000602082019050818103600083015261089b8161085f565b9050919050565b7f796f752068617665206772616262656400000000000000000000000000000000600082015250565b60006108d8601083610707565b91506108e3826108a2565b602082019050919050565b60006020820190508181036000830152610907816108cb565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610977826105ce565b9150610982836105ce565b9250826109925761099161090e565b5b828204905092915050565b60006109a8826105ce565b91506109b3836105ce565b92508282039050818111156109cb576109ca61093d565b5b92915050565b60006109dc82610602565b9050919050565b60006c0100000000000000000000000082029050919050565b6000610a07826109e3565b9050919050565b6000610a19826109fc565b9050919050565b610a31610a2c826109d1565b610a0e565b82525050565b6000610a42826109fc565b9050919050565b610a5a610a5582610622565b610a37565b82525050565b6000819050919050565b610a7b610a76826105ce565b610a60565b82525050565b6000610a8d8288610a20565b601482019150610a9d8287610a49565b601482019150610aad8286610a6a565b602082019150610abd8285610a6a565b602082019150610acd8284610a6a565b6020820191508190509695505050505050565b6000610aeb826105ce565b9150610af6836105ce565b925082610b0657610b0561090e565b5b828206905092915050565b6000610b1c826105ce565b9150610b27836105ce565b9250828201905080821115610b3f57610b3e61093d565b5b92915050565b6000610b50826105ce565b9150610b5b836105ce565b9250828202610b69816105ce565b91508282048414831517610b8057610b7f61093d565b5b5092915050565b6000610b92826105ce565b915060008203610ba557610ba461093d565b5b60018203905091905056fea2646970667358221220a12293b93034e847c234014e287b274c3366a483b3aa36ca64b6486dd925446364736f6c63430008140033";

type RedPacketConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RedPacketConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RedPacket__factory extends ContractFactory {
  constructor(...args: RedPacketConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string }
  ): Promise<RedPacket> {
    return super.deploy(overrides || {}) as Promise<RedPacket>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): RedPacket {
    return super.attach(address) as RedPacket;
  }
  override connect(signer: Signer): RedPacket__factory {
    return super.connect(signer) as RedPacket__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RedPacketInterface {
    return new utils.Interface(_abi) as RedPacketInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RedPacket {
    return new Contract(address, _abi, signerOrProvider) as RedPacket;
  }
}