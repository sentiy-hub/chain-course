/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface RedPacketInterface extends utils.Interface {
  functions: {
    "count()": FunctionFragment;
    "owner()": FunctionFragment;
    "totalAmount()": FunctionFragment;
    "deposit(uint256,bool)": FunctionFragment;
    "getBalance()": FunctionFragment;
    "grabRedEnvelope()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "count"
      | "owner"
      | "totalAmount"
      | "deposit"
      | "getBalance"
      | "grabRedEnvelope"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "count", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "grabRedEnvelope",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "count", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBalance", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "grabRedEnvelope",
    data: BytesLike
  ): Result;

  events: {
    "DepositMade(address,uint256,uint256,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DepositMade"): EventFragment;
}

export interface DepositMadeEventObject {
  depositor: string;
  amount: BigNumber;
  count: BigNumber;
  isEqual: boolean;
}
export type DepositMadeEvent = TypedEvent<
  [string, BigNumber, BigNumber, boolean],
  DepositMadeEventObject
>;

export type DepositMadeEventFilter = TypedEventFilter<DepositMadeEvent>;

export interface RedPacket extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RedPacketInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    count(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    totalAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    deposit(
      c: BigNumberish,
      _isEqual: boolean,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;

    getBalance(overrides?: CallOverrides): Promise<[BigNumber]>;

    grabRedEnvelope(
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  count(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  totalAmount(overrides?: CallOverrides): Promise<BigNumber>;

  deposit(
    c: BigNumberish,
    _isEqual: boolean,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  getBalance(overrides?: CallOverrides): Promise<BigNumber>;

  grabRedEnvelope(
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    count(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    totalAmount(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      c: BigNumberish,
      _isEqual: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    getBalance(overrides?: CallOverrides): Promise<BigNumber>;

    grabRedEnvelope(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "DepositMade(address,uint256,uint256,bool)"(
      depositor?: string | null,
      amount?: null,
      count?: null,
      isEqual?: null
    ): DepositMadeEventFilter;
    DepositMade(
      depositor?: string | null,
      amount?: null,
      count?: null,
      isEqual?: null
    ): DepositMadeEventFilter;
  };

  estimateGas: {
    count(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    totalAmount(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      c: BigNumberish,
      _isEqual: boolean,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;

    getBalance(overrides?: CallOverrides): Promise<BigNumber>;

    grabRedEnvelope(
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    count(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      c: BigNumberish,
      _isEqual: boolean,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    getBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    grabRedEnvelope(
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
