import "./StayPlatformVerifier.sol";
import "./Main.sol";
import "./polygoncontracts/validators/CredentialAtomicQuerySigValidator.sol";
import "./polygoncontracts/verifiers/ZKPVerifier.sol";

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

contract ExampleVerifier is StayPlatformVerifier, ZKPVerifier {
    address private ownerAddr;
    uint64 public constant TRANSFER_REQUEST_ID = 1;
    // we wouldn't do this in production, but this makes it easier to do
    // hardhat testing
    address private stayPlatformAddress;

    // constructor that sets address owner.
    constructor(address ownerAddress, address stayPlatformAddr) {
        ownerAddr = ownerAddress;
        stayPlatformAddress = stayPlatformAddr;
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

    function verify(address guest) public view returns (address) {
        // Use Polygon ID to check that the guest is male or female.
        // CredentialAtomicQuerySigValidator validator = CredentialAtomicQuerySigValidator(
        //         address(0x0)
        //     );
        require(proofs[guest][TRANSFER_REQUEST_ID], "No proof");

        // Check that guest has more than half positive ratings if they do
        // have ratings.
        StayPlatform stayPlatform = StayPlatform(stayPlatformAddress);
        bool goodRatings = stayPlatform.guestTotalRatings(guest) == 0 ||
            (stayPlatform.guestNetRatings(guest) * 2 >
                stayPlatform.guestTotalRatings(guest));
        if (!goodRatings) {
            return address(0);
        }

        return ownerAddr;
    }
}
