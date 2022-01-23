pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract RaremintsERC721 is ERC721Enumerable, Ownable {
  using Strings for uint256;

    string _baseTokenURI;
    uint256 private _reserved = 0;
    uint256 private _price;
    uint256 private _supply;
    bool public _paused = false;
    bool public baseURIFinal = false;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initialBaseURI,
        uint256 _initialPrice,
        uint256 _initialSupply
    ) ERC721(_name, _symbol)  {
        setBaseURI(_initialBaseURI);
        setPrice(_initialPrice);
        setSupply(_initialSupply);
    }

    function mint(uint256 num) public payable {
        uint256 supply = totalSupply();
        require( !_paused,                              "Sale paused" );
        require( supply + num < _supply - _reserved,    "Exceeds maximum supply" );
        require( msg.value >= _price * num,             "Ether sent is not correct" );

        for(uint256 i; i < num; i++){
            _safeMint(msg.sender, supply + i);
        }
    }

    function walletOfOwner(address _owner) public view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for(uint256 i; i < tokenCount; i++){
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    // Just in case Eth does some crazy stuff
    function setPrice(uint256 _newPrice) public onlyOwner() {
        _price = _newPrice;
    }

    function setSupply(uint256 _newSupply) public onlyOwner() {
        _supply = _newSupply;
    }

    function getSupply() public view returns (uint256) {
        return _supply;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        require(!baseURIFinal, "Base URL is unchangeable");
        _baseTokenURI = baseURI;
    }

    function getBaseURI() public view returns (string memory) {
        return _baseTokenURI;
    }

    function getPrice() public view returns (uint256){
        return _price;
    }

    function giveAway(address _to, uint256 _amount) internal {
        uint256 supply = totalSupply();
        require(supply + _amount < _supply - _reserved, "Exceeds maximum supply");
        for(uint256 i; i < _amount; i++){
            _safeMint(_to, supply + i);
        }
    }

    function airdrop(address[] memory addresses, uint[] memory amounts) external onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            giveAway(addresses[i], amounts[i]);
        }
    }

    function setPause(bool val) public onlyOwner {
        _paused = val;
    }

    function isPaused() public view returns (bool) {
        return _paused;
    }


    function withdraw() public payable onlyOwner returns (uint256) {
        uint256 sent = address(this).balance;
        require(payable(msg.sender).send(sent));
        return sent;
    }

    function finalizeBaseURI() external onlyOwner {
        baseURIFinal = true;
    }
}
