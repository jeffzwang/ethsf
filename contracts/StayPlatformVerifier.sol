// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC721/IERC721.sol)

pragma solidity ^0.8.15;

interface StayPlatformVerifier {
    function verify(address guest) external view returns (address);
}
