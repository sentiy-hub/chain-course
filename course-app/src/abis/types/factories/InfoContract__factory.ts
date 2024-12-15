/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { InfoContract, InfoContractInterface } from "../InfoContract";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "age",
        type: "uint256",
      },
    ],
    name: "Instructor",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_age",
        type: "uint256",
      },
    ],
    name: "setInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sayHi",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getInfo",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506107cf806100206000396000f3fe608060405234801561001057600080fd5b506004361061005e576000357c0100000000000000000000000000000000000000000000000000000000900480630c49c36c146100635780635a9b0b89146100815780638262963b146100a0575b600080fd5b61006b6100bc565b6040516100789190610279565b60405180910390f35b6100896100f9565b6040516100979291906102b4565b60405180910390f35b6100ba60048036038101906100b59190610459565b610195565b005b60606040518060400160405280600281526020017f4869000000000000000000000000000000000000000000000000000000000000815250905090565b606060008060015481805461010d906104e4565b80601f0160208091040260200160405190810160405280929190818152602001828054610139906104e4565b80156101865780601f1061015b57610100808354040283529160200191610186565b820191906000526020600020905b81548152906001019060200180831161016957829003601f168201915b50505050509150915091509091565b81600090816101a491906106c7565b50806001819055507f010becc10ca1475887c4ec429def1ccc2e9ea1713fe8b0d4e9a1d009042f6b8e82826040516101dd9291906102b4565b60405180910390a15050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610223578082015181840152602081019050610208565b60008484015250505050565b6000601f19601f8301169050919050565b600061024b826101e9565b61025581856101f4565b9350610265818560208601610205565b61026e8161022f565b840191505092915050565b600060208201905081810360008301526102938184610240565b905092915050565b6000819050919050565b6102ae8161029b565b82525050565b600060408201905081810360008301526102ce8185610240565b90506102dd60208301846102a5565b9392505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61033a8261022f565b810181811067ffffffffffffffff8211171561035957610358610302565b5b80604052505050565b600061036c6102e4565b90506103788282610331565b919050565b600067ffffffffffffffff82111561039857610397610302565b5b6103a18261022f565b9050602081019050919050565b82818337600083830152505050565b60006103d06103cb8461037d565b610362565b9050828152602081018484840111156103ec576103eb6102fd565b5b6103f78482856103ae565b509392505050565b600082601f830112610414576104136102f8565b5b81356104248482602086016103bd565b91505092915050565b6104368161029b565b811461044157600080fd5b50565b6000813590506104538161042d565b92915050565b600080604083850312156104705761046f6102ee565b5b600083013567ffffffffffffffff81111561048e5761048d6102f3565b5b61049a858286016103ff565b92505060206104ab85828601610444565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806104fc57607f821691505b60208210810361050f5761050e6104b5565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b60008160020a8302905092915050565b60006008830261057a7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261053a565b610584868361053a565b95508019841693508086168417925050509392505050565b6000819050919050565b60006105c16105bc6105b78461029b565b61059c565b61029b565b9050919050565b6000819050919050565b6105db836105a6565b6105ef6105e7826105c8565b84845461054a565b825550505050565b600090565b6106046105f7565b61060f8184846105d2565b505050565b5b81811015610633576106286000826105fc565b600181019050610615565b5050565b601f8211156106785761064981610515565b6106528461052a565b81016020851015610661578190505b61067561066d8561052a565b830182610614565b50505b505050565b60008160020a8304905092915050565b600061069e6000198460080261067d565b1980831691505092915050565b60006106b7838361068d565b9150826002028217905092915050565b6106d0826101e9565b67ffffffffffffffff8111156106e9576106e8610302565b5b6106f382546104e4565b6106fe828285610637565b600060209050601f831160018114610731576000841561071f578287015190505b61072985826106ab565b865550610791565b601f19841661073f86610515565b60005b8281101561076757848901518255600182019150602085019450602081019050610742565b868310156107845784890151610780601f89168261068d565b8355505b6001600288020188555050505b50505050505056fea264697066735822122046631367ea1a979ad01dc9967c979097f4627d362ef0a539d2cf77f1ae5b00b064736f6c63430008140033";

type InfoContractConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: InfoContractConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class InfoContract__factory extends ContractFactory {
  constructor(...args: InfoContractConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string }
  ): Promise<InfoContract> {
    return super.deploy(overrides || {}) as Promise<InfoContract>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): InfoContract {
    return super.attach(address) as InfoContract;
  }
  override connect(signer: Signer): InfoContract__factory {
    return super.connect(signer) as InfoContract__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): InfoContractInterface {
    return new utils.Interface(_abi) as InfoContractInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InfoContract {
    return new Contract(address, _abi, signerOrProvider) as InfoContract;
  }
}