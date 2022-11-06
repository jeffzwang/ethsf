import "./StayPlatformVerifier.sol";
import "./Main.sol";
import "./polygoncontracts/validators/CredentialAtomicQuerySigValidator.sol";
import "./polygoncontracts/verifiers/ZKPVerifier.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

contract ExampleVerifier is StayPlatformVerifier, ZKPVerifier, ERC721 {
    address private ownerAddr;
    uint64 public constant TRANSFER_REQUEST_ID = 1;
    // we wouldn't do this in production, but this makes it easier to do
    // hardhat testing
    StayPlatform private stayPlatform;

    // constructor that sets address owner.
    constructor(address ownerAddress, address stayPlatformAddr)
        ERC721("ExampleVerifier", "EXAMPLE")
    {
        ownerAddr = ownerAddress;
        stayPlatform = StayPlatform(stayPlatformAddr);
    }

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
        _safeMint(_msgSender(), 0);
        stayPlatform.createStayTransactionWithoutAuth(
            0,
            1,
            0,
            address(0x6CC094360F352c4F03EFB23F253361Af54A2CFeD),
            3,
            address(0),
            ""
        );
    }

    function verify(address guest) public view returns (address) {
        // Use Polygon ID to check that the guest is male or female.
        // CredentialAtomicQuerySigValidator validator = CredentialAtomicQuerySigValidator(
        //         address(0x0)
        //     );
        require(proofs[guest][TRANSFER_REQUEST_ID], "No proof");

        // Check that guest has more than half positive ratings if they do
        // have ratings.
        bool goodRatings = stayPlatform.guestTotalRatings(guest) == 0 ||
            (stayPlatform.guestNetRatings(guest) * 2 >
                stayPlatform.guestTotalRatings(guest));
        if (!goodRatings) {
            return address(0);
        }

        return ownerAddr;
    }
}
