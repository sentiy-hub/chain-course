// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 导入OpenZeppelin的ERC721基础合约
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// 导入URI存储扩展，用于存储NFT的元数据URI
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// @title 简单的NFT合约
// @notice 这是一个基础的ERC721实现，支持铸造和URI存储
contract LaoyuanERC721Coin is ERC721, ERC721URIStorage {
    // 用于追踪下一个要铸造的token ID
    uint256 private _nextTokenId;

    /// @notice 构造函数，初始化NFT集合的名称和符号
    /// @param name NFT集合的名称
    /// @param symbol NFT集合的符号
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    /// @notice 安全铸造新的NFT
    /// @param to 接收NFT的地址
    /// @param uri NFT的元数据URI，指向描述NFT的JSON文件
    /// @dev 这个函数会自动递增tokenId
    function safeMint(address to, string memory uri) public {
        // 获取当前tokenId并递增计数器
        uint256 tokenId = _nextTokenId++;
        // 调用ERC721的_safeMint函数铸造NFT
        _safeMint(to, tokenId);
        // 为新铸造的NFT设置URI
        _setTokenURI(tokenId, uri);
    }

    /// @notice 获取指定NFT的元数据URI
    /// @param tokenId NFT的唯一标识符
    /// @return NFT的元数据URI字符串
    /// @dev 必须重写此函数以解决继承冲突
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /// @notice 实现ERC165接口，用于合约接口的识别
    /// @param interfaceId 要查询的接口ID
    /// @return bool 如果合约实现了查询的接口则返回true
    /// @dev 必须重写此函数以解决继承冲突
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
