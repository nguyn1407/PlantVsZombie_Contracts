// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./IBox.sol";

contract Box is ERC1155, IBox{
  address private _addressOfPlantVsZombieNftContract;

  constructor(address addressOfContract, string memory uri_) ERC1155(uri_){
    _addressOfPlantVsZombieNftContract = addressOfContract;
  }

  function mint(address to, uint256 id, uint256 amount) external {
    require(msg.sender == _addressOfPlantVsZombieNftContract, "Box: not is PlantVsZombieNftContract");
    _mint(to, id, amount, "");
  }

  function burn(address from, uint256 id, uint256 amount) external {
    require(msg.sender == _addressOfPlantVsZombieNftContract, "Box: not is PlantVsZombieNftContract");
    _burn(from, id, amount);
  }
}
