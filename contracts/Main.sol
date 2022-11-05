// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
// for console.log usage
import "hardhat/console.sol";

contract StayPlatform is ERC2771Context, ERC721, EIP712 {
    using Strings for uint256;

    address private owner;
    address private erc20ContractAddress;

    struct StayTransaction {
        uint256 startTime;
        uint256 endTime;
        uint256 price;
        address guest;
        address host;
        // The timestamp by which an arbiter can arbit the transaction and by which
        // host can withdraw funds.
        uint256 arbitrationDeadline;
        // If address(0x0), no arbitration.
        address arbiter;
        string tokenURI;
        bool hostWasRated;
        bool guestWasRated;
    }

    bytes32 private constant _TYPEHASH =
        keccak256(
            "StayTransaction(uint256 startTime,uint256 endTime,uint256 price,address guest,address host,uint256 arbitrationDeadline,address arbiter)"
        );

    mapping(uint256 => string) private _tokenURIs;

    // mapping from bid on tokenId to bid
    mapping(uint256 => StayTransaction) private stayTransactions;

    mapping(address => uint256) private _balances;

    mapping(address => uint256) public hostNetRatings;
    mapping(address => uint256) public hostTotalRatings;
    mapping(address => uint256) public guestNetRatings;
    mapping(address => uint256) public guestTotalRatings;

    // Base URI
    string private _baseURIextended;

    constructor(address trustedForwarder_, address erc20Contract)
        ERC721("StayTransaction", "STAY")
        ERC2771Context(trustedForwarder_)
        EIP712("StayPlatform", "0.0.1")
    {
        owner = _msgSender();
        erc20ContractAddress = erc20Contract;
    }

    function _msgSender()
        internal
        view
        virtual
        override(Context, ERC2771Context)
        returns (address sender)
    {
        return ERC2771Context._msgSender();
    }

    function _msgData()
        internal
        view
        virtual
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }

    modifier onlyOwner() {
        require(_msgSender() == owner, "owner is not _msgSender");
        _;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }

    function createStayTransaction(
        uint256 startTime,
        uint256 endTime,
        uint256 price,
        address host,
        uint256 arbitrationDeadline,
        address arbiter,
        string memory _tokenURI,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public payable returns (uint256 tokenId) {
        require(host != _msgSender(), "host cannot be guest");
        // Check signature usiing v, r, s.
        bytes32 message = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    _TYPEHASH,
                    startTime,
                    endTime,
                    price,
                    _msgSender(),
                    host,
                    arbitrationDeadline,
                    arbiter
                )
            )
        );
        address signer = ecrecover(message, v, r, s);
        require(
            signer == host,
            "invalid signature. Make sure that host signed correctly."
        );

        ERC20 usdc = ERC20(erc20ContractAddress);
        bool transferSuccess = usdc.transferFrom(
            _msgSender(),
            address(this),
            price
        );
        require(transferSuccess, "transfer failed");
        _balances[host] += price;

        // Convert _tokenURI to a uint256 using hashing.
        // This is to prevent the same _tokenURI from being used twice.
        tokenId = uint256(keccak256(abi.encodePacked(_tokenURI)));
        // Print the tokenID as a hex string.
        console.log("tokenId: %s", tokenId.toHexString());

        stayTransactions[tokenId] = StayTransaction(
            startTime,
            endTime,
            price,
            _msgSender(),
            host,
            arbitrationDeadline,
            arbiter,
            _tokenURI,
            false,
            false
        );

        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return tokenId;
    }

    function withdrawHostFunds(uint256 tokenId) public {
        StayTransaction memory transaction = stayTransactions[tokenId];
        require(
            transaction.host == _msgSender(),
            "only host can withdraw funds"
        );
        require(
            block.timestamp > transaction.arbitrationDeadline,
            "cannot withdraw funds before arbitration deadline"
        );
        require(
            _balances[transaction.host] > 0,
            "host has no funds to withdraw"
        );
        ERC20 usdc = ERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
        bool transferSuccess = usdc.transfer(
            transaction.host,
            transaction.price
        );
        require(transferSuccess, "transfer failed");
        _balances[transaction.host] -= transaction.price;
    }

    function triggerArbitrationFundsReturn(uint256 tokenId) public {
        StayTransaction memory transaction = stayTransactions[tokenId];
        require(transaction.arbiter != address(0), "no arbiter");
        require(
            transaction.arbiter == _msgSender(),
            "only arbiter can trigger arbitration"
        );
        require(
            block.timestamp < transaction.arbitrationDeadline,
            "cannot trigger arbitration after arbitration deadline"
        );
        ERC20 usdc = ERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
        bool transferSuccess = usdc.transfer(
            transaction.guest,
            transaction.price
        );
        require(transferSuccess, "transfer failed");
        _balances[transaction.host] -= transaction.price;
    }

    function rateHost(bool positive, uint256 tokenID) public {
        StayTransaction memory transaction = stayTransactions[tokenID];
        require(transaction.guest == _msgSender(), "only guest can rate host");
        require(
            block.timestamp > transaction.endTime,
            "cannot rate before end of stay"
        );
        require(!transaction.guestWasRated, "guest has already rated host");
        hostTotalRatings[transaction.host] += 1;
        if (positive) {
            hostNetRatings[transaction.host] += 1;
        } else {
            hostNetRatings[transaction.host] -= 1;
        }
        stayTransactions[tokenID].hostWasRated = true;
    }

    function rateGuest(bool positive, uint256 tokenID) public {
        StayTransaction memory transaction = stayTransactions[tokenID];
        require(transaction.host == _msgSender(), "only host can rate guest");
        require(
            block.timestamp > transaction.endTime,
            "cannot rate before end of stay"
        );
        require(!transaction.guestWasRated, "host has already rated guest");
        guestTotalRatings[transaction.guest] += 1;
        if (positive) {
            guestNetRatings[transaction.guest] += 1;
        } else {
            guestNetRatings[transaction.guest] -= 1;
        }
        stayTransactions[tokenID].guestWasRated = true;
    }
}
