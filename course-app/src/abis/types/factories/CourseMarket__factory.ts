/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { CourseMarket, CourseMarketInterface } from "../CourseMarket";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_yiDengToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "web2CourseId",
        type: "string",
      },
    ],
    name: "CoursePurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "courseCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "courses",
    outputs: [
      {
        internalType: "string",
        name: "web2CourseId",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userCourses",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "web2ToCourseId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "yiDengToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "web2CourseId",
        type: "string",
      },
    ],
    name: "purchaseCourse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "string",
        name: "web2CourseId",
        type: "string",
      },
    ],
    name: "hasCourse",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "web2CourseId",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "addCourse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001e3238038062001e3283398181016040528101906200003791906200023e565b33600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000ad5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000a4919062000281565b60405180910390fd5b620000c78162000110640100000000026401000000009004565b5080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506200029e565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200020682620001d9565b9050919050565b6200021881620001f9565b81146200022457600080fd5b50565b60008151905062000238816200020d565b92915050565b600060208284031215620002575762000256620001d4565b5b6000620002678482850162000227565b91505092915050565b6200027b81620001f9565b82525050565b600060208201905062000298600083018462000270565b92915050565b611b8480620002ae6000396000f3fe608060405234801561001057600080fd5b50600436106100c6576000357c0100000000000000000000000000000000000000000000000000000000900480638da5cb5b1161008e5780638da5cb5b1461014957806393a05c201461016757806396f979d2146101975780639b84006e146101cb578063dd403ce1146101fb578063f2fde38b1461022b576100c6565b80630262232b146100cb57806344a8ef19146100e9578063660551591461010557806367589b6f14610123578063715018a61461013f575b600080fd5b6100d3610247565b6040516100e09190610ee7565b60405180910390f35b61010360048036038101906100fe9190611092565b61026d565b005b61010d610451565b60405161011a919061112c565b60405180910390f35b61013d60048036038101906101389190611147565b610457565b005b6101476109b4565b005b6101516109c8565b60405161015e91906111b1565b60405180910390f35b610181600480360381019061017c91906111f8565b6109f1565b60405161018e9190611253565b60405180910390f35b6101b160048036038101906101ac919061126e565b610a20565b6040516101c295949392919061131a565b60405180910390f35b6101e560048036038101906101e09190611147565b610b93565b6040516101f2919061112c565b60405180910390f35b6102156004803603810190610210919061137b565b610bc1565b6040516102229190611253565b60405180910390f35b610245600480360381019061024091906113d7565b610c8f565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610275610d15565b60008351116102b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102b090611450565b60405180910390fd5b60006003846040516102cb91906114ac565b9081526020016040518091039020541461031a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103119061150f565b60405180910390fd5b6005600081548092919061032d9061155e565b91905055506040518060a001604052808481526020018381526020018281526020016001151581526020013373ffffffffffffffffffffffffffffffffffffffff16815250600260006005548152602001908152602001600020600082015181600001908161039c91906117ae565b5060208201518160010190816103b291906117ae565b506040820151816002015560608201518160030160006101000a81548160ff02191690831515021790555060808201518160030160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555090505060055460038460405161043a91906114ac565b908152602001604051809103902081905550505050565b60055481565b600060038260405161046991906114ac565b9081526020016040518091039020549050600081116104bd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b4906118cc565b60405180910390fd5b6000600260008381526020019081526020016000206040518060a00160405290816000820180546104ed906115d5565b80601f0160208091040260200160405190810160405280929190818152602001828054610519906115d5565b80156105665780601f1061053b57610100808354040283529160200191610566565b820191906000526020600020905b81548152906001019060200180831161054957829003601f168201915b5050505050815260200160018201805461057f906115d5565b80601f01602080910402602001604051908101604052809291908181526020018280546105ab906115d5565b80156105f85780601f106105cd576101008083540402835291602001916105f8565b820191906000526020600020905b8154815290600101906020018083116105db57829003601f168201915b50505050508152602001600282015481526020016003820160009054906101000a900460ff161515151581526020016003820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681525050905080606001516106c2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106b990611938565b60405180910390fd5b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002060009054906101000a900460ff1615610760576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610757906119a4565b60405180910390fd5b8260405160200161077191906114ac565b60405160208183030381529060405280519060200120816000015160405160200161079c91906114ac565b60405160208183030381529060405280519060200120146107f2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107e990611a10565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd33836080015184604001516040518463ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040161087593929190611a30565b6020604051808303816000875af1158015610894573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108b89190611a93565b6108f7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108ee90611b0c565b60405180910390fd5b6001600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084815260200190815260200160002060006101000a81548160ff021916908315150217905550813373ffffffffffffffffffffffffffffffffffffffff167f1a04f8d389f43beccf2cc32092c53cb34d57ec70fd68693db2bfe79336db783c856040516109a79190611b2c565b60405180910390a3505050565b6109bc610d15565b6109c66000610d9c565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60046020528160005260406000206020528060005260406000206000915091509054906101000a900460ff1681565b6002602052806000526040600020600091509050806000018054610a43906115d5565b80601f0160208091040260200160405190810160405280929190818152602001828054610a6f906115d5565b8015610abc5780601f10610a9157610100808354040283529160200191610abc565b820191906000526020600020905b815481529060010190602001808311610a9f57829003601f168201915b505050505090806001018054610ad1906115d5565b80601f0160208091040260200160405190810160405280929190818152602001828054610afd906115d5565b8015610b4a5780601f10610b1f57610100808354040283529160200191610b4a565b820191906000526020600020905b815481529060010190602001808311610b2d57829003601f168201915b5050505050908060020154908060030160009054906101000a900460ff16908060030160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905085565b6003818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b600080600383604051610bd491906114ac565b908152602001604051809103902054905060008111610c28576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c1f906118cc565b60405180910390fd5b600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082815260200190815260200160002060009054906101000a900460ff1691505092915050565b610c97610d15565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610d095760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401610d0091906111b1565b60405180910390fd5b610d1281610d9c565b50565b610d1d610e60565b73ffffffffffffffffffffffffffffffffffffffff16610d3b6109c8565b73ffffffffffffffffffffffffffffffffffffffff1614610d9a57610d5e610e60565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401610d9191906111b1565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000610ead610ea8610ea384610e68565b610e88565b610e68565b9050919050565b6000610ebf82610e92565b9050919050565b6000610ed182610eb4565b9050919050565b610ee181610ec6565b82525050565b6000602082019050610efc6000830184610ed8565b92915050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610f6982610f20565b810181811067ffffffffffffffff82111715610f8857610f87610f31565b5b80604052505050565b6000610f9b610f02565b9050610fa78282610f60565b919050565b600067ffffffffffffffff821115610fc757610fc6610f31565b5b610fd082610f20565b9050602081019050919050565b82818337600083830152505050565b6000610fff610ffa84610fac565b610f91565b90508281526020810184848401111561101b5761101a610f1b565b5b611026848285610fdd565b509392505050565b600082601f83011261104357611042610f16565b5b8135611053848260208601610fec565b91505092915050565b6000819050919050565b61106f8161105c565b811461107a57600080fd5b50565b60008135905061108c81611066565b92915050565b6000806000606084860312156110ab576110aa610f0c565b5b600084013567ffffffffffffffff8111156110c9576110c8610f11565b5b6110d58682870161102e565b935050602084013567ffffffffffffffff8111156110f6576110f5610f11565b5b6111028682870161102e565b92505060406111138682870161107d565b9150509250925092565b6111268161105c565b82525050565b6000602082019050611141600083018461111d565b92915050565b60006020828403121561115d5761115c610f0c565b5b600082013567ffffffffffffffff81111561117b5761117a610f11565b5b6111878482850161102e565b91505092915050565b600061119b82610e68565b9050919050565b6111ab81611190565b82525050565b60006020820190506111c660008301846111a2565b92915050565b6111d581611190565b81146111e057600080fd5b50565b6000813590506111f2816111cc565b92915050565b6000806040838503121561120f5761120e610f0c565b5b600061121d858286016111e3565b925050602061122e8582860161107d565b9150509250929050565b60008115159050919050565b61124d81611238565b82525050565b60006020820190506112686000830184611244565b92915050565b60006020828403121561128457611283610f0c565b5b60006112928482850161107d565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156112d55780820151818401526020810190506112ba565b60008484015250505050565b60006112ec8261129b565b6112f681856112a6565b93506113068185602086016112b7565b61130f81610f20565b840191505092915050565b600060a082019050818103600083015261133481886112e1565b9050818103602083015261134881876112e1565b9050611357604083018661111d565b6113646060830185611244565b61137160808301846111a2565b9695505050505050565b6000806040838503121561139257611391610f0c565b5b60006113a0858286016111e3565b925050602083013567ffffffffffffffff8111156113c1576113c0610f11565b5b6113cd8582860161102e565b9150509250929050565b6000602082840312156113ed576113ec610f0c565b5b60006113fb848285016111e3565b91505092915050565b7f5765623220636f757273652049442063616e6e6f7420626520656d7074790000600082015250565b600061143a601e836112a6565b915061144582611404565b602082019050919050565b600060208201905081810360008301526114698161142d565b9050919050565b600081905092915050565b60006114868261129b565b6114908185611470565b93506114a08185602086016112b7565b80840191505092915050565b60006114b8828461147b565b915081905092915050565b7f436f7572736520616c7265616479206578697374730000000000000000000000600082015250565b60006114f96015836112a6565b9150611504826114c3565b602082019050919050565b60006020820190508181036000830152611528816114ec565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006115698261105c565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361159b5761159a61152f565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806115ed57607f821691505b602082108103611600576115ff6115a6565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b60008160020a8302905092915050565b60006008830261166b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261162b565b611675868361162b565b95508019841693508086168417925050509392505050565b60006116a86116a361169e8461105c565b610e88565b61105c565b9050919050565b6000819050919050565b6116c28361168d565b6116d66116ce826116af565b84845461163b565b825550505050565b600090565b6116eb6116de565b6116f68184846116b9565b505050565b5b8181101561171a5761170f6000826116e3565b6001810190506116fc565b5050565b601f82111561175f5761173081611606565b6117398461161b565b81016020851015611748578190505b61175c6117548561161b565b8301826116fb565b50505b505050565b60008160020a8304905092915050565b600061178560001984600802611764565b1980831691505092915050565b600061179e8383611774565b9150826002028217905092915050565b6117b78261129b565b67ffffffffffffffff8111156117d0576117cf610f31565b5b6117da82546115d5565b6117e582828561171e565b600060209050601f8311600181146118185760008415611806578287015190505b6118108582611792565b865550611878565b601f19841661182686611606565b60005b8281101561184e57848901518255600182019150602085019450602081019050611829565b8683101561186b5784890151611867601f891682611774565b8355505b6001600288020188555050505b505050505050565b7f436f7572736520646f6573206e6f742065786973740000000000000000000000600082015250565b60006118b66015836112a6565b91506118c182611880565b602082019050919050565b600060208201905081810360008301526118e5816118a9565b9050919050565b7f436f75727365206e6f7420616374697665000000000000000000000000000000600082015250565b60006119226011836112a6565b915061192d826118ec565b602082019050919050565b6000602082019050818103600083015261195181611915565b9050919050565b7f416c726561647920707572636861736564000000000000000000000000000000600082015250565b600061198e6011836112a6565b915061199982611958565b602082019050919050565b600060208201905081810360008301526119bd81611981565b9050919050565b7f436f75727365204944206d69736d617463680000000000000000000000000000600082015250565b60006119fa6012836112a6565b9150611a05826119c4565b602082019050919050565b60006020820190508181036000830152611a29816119ed565b9050919050565b6000606082019050611a4560008301866111a2565b611a5260208301856111a2565b611a5f604083018461111d565b949350505050565b611a7081611238565b8114611a7b57600080fd5b50565b600081519050611a8d81611a67565b92915050565b600060208284031215611aa957611aa8610f0c565b5b6000611ab784828501611a7e565b91505092915050565b7f5472616e73666572206661696c65640000000000000000000000000000000000600082015250565b6000611af6600f836112a6565b9150611b0182611ac0565b602082019050919050565b60006020820190508181036000830152611b2581611ae9565b9050919050565b60006020820190508181036000830152611b4681846112e1565b90509291505056fea26469706673582212207f7d79e12dc12db6e99e911d7693bffe02cc4e849bea505be6c5a93fe906807464736f6c63430008140033";

type CourseMarketConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CourseMarketConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CourseMarket__factory extends ContractFactory {
  constructor(...args: CourseMarketConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _yiDengToken: string,
    overrides?: Overrides & { from?: string }
  ): Promise<CourseMarket> {
    return super.deploy(_yiDengToken, overrides || {}) as Promise<CourseMarket>;
  }
  override getDeployTransaction(
    _yiDengToken: string,
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(_yiDengToken, overrides || {});
  }
  override attach(address: string): CourseMarket {
    return super.attach(address) as CourseMarket;
  }
  override connect(signer: Signer): CourseMarket__factory {
    return super.connect(signer) as CourseMarket__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CourseMarketInterface {
    return new utils.Interface(_abi) as CourseMarketInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CourseMarket {
    return new Contract(address, _abi, signerOrProvider) as CourseMarket;
  }
}
