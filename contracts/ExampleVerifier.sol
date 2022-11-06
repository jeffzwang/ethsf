import "./Main.sol";
import "./polygoncontracts/validators/CredentialAtomicQuerySigValidator.sol";
import "./polygoncontracts/verifiers/ZKPVerifier.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

contract ExampleVerifier is ZKPVerifier, ERC721 {
    uint256 counter = 0;
    uint64 public constant TRANSFER_REQUEST_ID = 1;

    constructor() ERC721("ExampleVerifier", "EXAMPLE") {}

    function _beforeProofSubmit(
        uint64, /* requestId */
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        // check that  challenge input is address of sender
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        // this is linking between msg.sender and
        require(
            _msgSender() == addr,
            "address in proof is not a sender address"
        );
    }

    function _afterProofSubmit(
        uint64,
        uint256[] memory,
        ICircuitValidator
    ) internal override {
        _safeMint(_msgSender(), counter);
        counter += 1;
    }
}
