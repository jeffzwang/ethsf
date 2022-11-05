import "./IVerifier.sol";

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC721/IERC721.sol)

pragma solidity ^0.8.15;

contract ExampleVerifier is IVerifier {
    function verify(address guest) public pure returns (bool) {
        // Use Polygon ID to check that the guest is male or female.
    }
}
