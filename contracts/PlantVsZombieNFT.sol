// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FactoryPlant.sol";
import "./IBox.sol";

contract PlantVsZombieNFT is ERC721, FactoryPlant {
  uint128 private _amountPlantFood;
  uint128 private _amountBox;
  uint128 private _amountBoxVip;
  uint256 private _priceOfPlantFood;
  uint256 private _priceOfBox;
  uint256 private _priceOfBoxVip;
  uint8 private _tokenIdOfBoxVip;
  uint8 private _tokenIdOfBox;
  address private _addressOfCoinUse;
  address private _addressOfBoxContract;
  bool private _ableBuyBoxVip;
  uint256 private _tokenId;
  IERC20 private _coinUse;
  IBox private _boxContract;

  struct Plant {
    string name;
    uint16 suncost;
    uint16 damage;
    uint16 toughness;
    uint16 recharge;
    uint16 speed;
    uint8 numberPlantFood;
    bool isVip;
  }

  mapping(address => uint128) amountPlantFoodUserHaves;
  mapping(uint => Plant) plants;

  event ImcrementBox(uint128 amountBoxImcrement);
  event ImcrementBoxVip(uint128 amountBoxVipImcrement);
  event ImcrementPlantFood(uint128 amountPlantFoodImcrement);
  event UpdatePriceOfBox(uint256 priceOfBoxNew);
  event UpdatePriceOfBoxVip(uint256 priceOfBoxVipNew);
  event UpdatePriceOfPlantFood(uint256 priceOfPlantFoodNew);
  event UpdateAddressOfCoinUse(address addressOfCoinUse);
  event UpdateAddressBoxUse(address addressOfBoxUse);
  event BuyBox(address addressOfBuyer,bool isVip, uint128 amountBoxBuy);
  event BuyPlantFood(address addressOfBuyer, uint128 amountPlantFoodBuy);
  event UnBox(address OwnerOfPlant, Plant plant,uint256 tokenId);
  event AbleBuyBoxVip(address account);
  event UnableBuyBoxVip(address account);
  event UsePlantFood(address account, uint256 tokenId, uint8 properties);

  constructor(string memory name_, string memory symbol_, uint64 subscriptionId_) ERC721(name_, symbol_) FactoryPlant( subscriptionId_) {
    _tokenIdOfBoxVip = 1;
    _tokenIdOfBox = 2;
    _pause();
  }

  function getAmountBox() public view returns(uint128) {
    return _amountBox;
  }

  function getAmountBoxVip() public view returns(uint128) {
    return _amountBoxVip;
  }

  function getPlantFood() public view returns(uint128) {
    return _amountPlantFood;
  }

  function getPriceOfBox() public view returns(uint256) {
    return _priceOfBox;
  }

  function getPriceOfBoxVip() public view returns(uint256) {
    return _priceOfBoxVip;
  }

  function getPriceOfPlantFood() public view returns(uint256) {
    return _priceOfPlantFood;
  }

  function getAddressOfCoinUse() public view returns(address) {
    return _addressOfCoinUse;
  }

  function getAbleBuyBoxVip() public view returns(bool) {
    return _ableBuyBoxVip;
  }

  function getAddressOfBoxContractUse() public view returns(address) {
    return _addressOfBoxContract;
  } 

  function getAmountPlantFoodUserHaves(address _addressUse) public view returns(uint128) {
    return amountPlantFoodUserHaves[_addressUse];
  }

  function imcrementBox(uint128 _amountBoxImcrement) public onlyOwner() {
    _amountGreaterThanZero(_amountBoxImcrement);
    _amountBox += _amountBoxImcrement;
    emit ImcrementBox( _amountBoxImcrement);
  }

  function imcrementBoxVip(uint128 _amountBoxVipImcrement) public onlyOwner() {
    _amountGreaterThanZero(_amountBoxVipImcrement);
    _amountBoxVip += _amountBoxVipImcrement;
    emit ImcrementBoxVip(_amountBoxVipImcrement);
  }

  function imcrementPlantFood(uint128 _amountPlantFoodImcrement) public onlyOwner() {
    _amountGreaterThanZero(_amountPlantFoodImcrement);
    _amountPlantFood += _amountPlantFoodImcrement;
    emit ImcrementPlantFood(_amountPlantFoodImcrement);
  }

  function setPriceOfBox(uint256 _priceOfBoxNew) public onlyOwner() whenPaused() {
    _priceOfBox = _priceOfBoxNew;
    emit UpdatePriceOfBox(_priceOfBox);
  }

  function setPriceOfBoxVip(uint256 _priceOfBoxVipNew) public onlyOwner() whenPaused() {
    _priceOfBoxVip = _priceOfBoxVipNew;
    emit UpdatePriceOfBoxVip(_priceOfBoxVip);
  }

  function setPriceOfPlantFood(uint256 _priceOfPlantFoodNew ) public onlyOwner() whenPaused() {
    _priceOfPlantFood = _priceOfPlantFoodNew;
    emit UpdatePriceOfPlantFood(_priceOfPlantFood);
  }

  function setAddressOfCoinUse(address _addressOfCoin) public onlyOwner() whenPaused() {
    _addressOfCoinUse = _addressOfCoin;
    _coinUse = IERC20(_addressOfCoin);
    emit UpdateAddressOfCoinUse(_addressOfCoin);
  }

  function setAddressOfBox(address _addressContractBox) public onlyOwner() whenPaused() {
    _addressOfBoxContract = _addressContractBox;
    _boxContract = IBox(_addressOfBoxContract);
    emit UpdateAddressBoxUse(_addressContractBox);
  }

  function _amountGreaterThanZero(uint256 _amountInput) internal pure {
    require(_amountInput > 0, "PlantVsZombieNFT: amount must be greater than zero");
  } 

  function pause() public onlyOwner() {
    _pause();
  }

  function unpause() public onlyOwner() {
    _unpause();
  }

  function ableBuyBoxVip() public onlyOwner() {
    require(_ableBuyBoxVip == false, 'allowed to buy box');
    _ableBuyBoxVip = true;
    emit AbleBuyBoxVip(_msgSender());
  }

  function unableBuyBoxVip() public onlyOwner() {
    require( _ableBuyBoxVip == true, 'not allowed to buy box');
    _ableBuyBoxVip = false;
    emit UnableBuyBoxVip(_msgSender());
  }

  function _buyBoxVip(uint128 _amountBoxBuy) internal {
    _amountBoxVip -= _amountBoxBuy;
    _coinUse.transferFrom(_msgSender(), owner(), _priceOfBoxVip * _amountBoxBuy );
    _boxContract.mint(_msgSender(), _tokenIdOfBoxVip, _amountBoxBuy);
    emit BuyBox(_msgSender(), true, _amountBoxBuy);
  }

  function _buyBox(uint128 _amountBoxBuy) internal {
    _amountBox -= _amountBoxBuy;
    _coinUse.transferFrom(_msgSender(), owner(), _priceOfBox * _amountBoxBuy );
    _boxContract.mint(_msgSender(), _tokenIdOfBox, _amountBoxBuy);
    emit BuyBox(_msgSender(), false, _amountBoxBuy);
  }

  function buyBox(bool isVip, uint128 _amountBoxBuy) public whenNotPaused() {
    require(_amountBoxBuy > 0,"PlantVsZombieNFT: amountBoxBuy must be greater than zero");
    if(isVip) {
        require(_amountBoxVip >= _amountBoxBuy,"PlantVsZombieNFT: amountBoxVip Supply must be greater than amountBoxBuy");
        require(_ableBuyBoxVip == true,"PlantVsZombieNFT: must able Buy Box Vip");
        _buyBoxVip(_amountBoxBuy);
    }
    else {
        require(_amountBox >= _amountBoxBuy,"PlantVsZombieNFT: amountBoxVip Supply must be greater than amountBoxBuy");
        _buyBox(_amountBoxBuy);
    }
  }

  function _createPlant(string memory _nameOfPlant) internal returns(Plant memory) {
    uint16[5] memory _propertiesPlant = _randomPropertiesPlant(false);
    Plant memory newPlant = Plant({
        name: _nameOfPlant,
        suncost: _propertiesPlant[0],
        damage: _propertiesPlant[1],
        toughness: _propertiesPlant[2],
        recharge: _propertiesPlant[3],
        speed: _propertiesPlant[4],
        numberPlantFood: 3,
        isVip: false
    });
    return newPlant;
  }

  function _createPlantVip(string memory _nameOfPlant) internal returns(Plant memory) {
    uint16[5] memory _propertiesPlantVip = _randomPropertiesPlant(true);
    Plant memory newPlant = Plant({
        name: _nameOfPlant,
        suncost: _propertiesPlantVip[0],
        damage: _propertiesPlantVip[1],
        toughness: _propertiesPlantVip[2],
        recharge: _propertiesPlantVip[3],
        speed: _propertiesPlantVip[4],
        numberPlantFood: 5,
        isVip: true
    });
    return newPlant;
  }

  function _unbox(string memory name_) internal {
    require(_boxContract.balanceOf(_msgSender(), _tokenIdOfBox) > 0 ,"PlantVsZombieNFT: amount box of user must be greate than zero");
    _boxContract.burn(_msgSender(), _tokenIdOfBox, 1);
    _tokenId +=1;
    _mint(_msgSender(), _tokenId);
    Plant memory newPlant = _createPlant(name_);
    plants[_tokenId] = newPlant;
    emit UnBox(_msgSender(), newPlant, _tokenId);
  }

  function _unBoxVip(string memory name_) internal {
    require(_boxContract.balanceOf(_msgSender(), _tokenIdOfBoxVip) > 0 ,"PlantVsZombieNFT: amount box Vip of user must be greate than zero");
    _boxContract.burn(_msgSender(), _tokenIdOfBoxVip, 1);
    _tokenId +=1;
    _mint(_msgSender(), _tokenId);
    Plant memory newPlant = _createPlantVip(name_);
    plants[_tokenId] = newPlant;
    emit UnBox(_msgSender(), newPlant, _tokenId);
  }

  function unBox(bool isVip, string memory name_ ) public whenNotPaused() {
    if(isVip) {
        _unBoxVip(name_);
    }
    else {
        _unbox(name_);
    }
  }

  function buyPlantFood(uint128 _amountPlantFoodBuy) public whenNotPaused() {
    require(_amountPlantFoodBuy > 0,"PlantVsZombieNFT: amountFlantFoodBuy must be greater than zero");
    require(_amountPlantFood > _amountPlantFoodBuy,"PlantVsZombieNFT: amountFlantFood Suppoly must be greater than amountPlantFoodBuy");
    _coinUse.transferFrom(_msgSender(), owner(), _priceOfPlantFood * _amountPlantFoodBuy);
    amountPlantFoodUserHaves[_msgSender()] += _amountPlantFoodBuy;
    _amountPlantFood -= _amountPlantFoodBuy;
    emit BuyPlantFood(_msgSender(), _amountPlantFoodBuy);
  }

  function _usePlantFoodForSunCost(uint256 _tokenIdOfPlant) internal {
    plants[_tokenIdOfPlant].suncost -= 10;
  }

  function _usePlantFoodForDamage(uint256 _tokenIdOfPlant) internal {
    plants[_tokenIdOfPlant].damage += 20;
  }

  function _usePlantFoodForToughness(uint256 _tokenIdOfPlant) internal {
    plants[_tokenIdOfPlant].toughness += 100;
  }

  function _usePlantFoodForRecharge(uint256 _tokenIdOfPlant) internal {
    plants[_tokenIdOfPlant].recharge -= 2;
  }

  function _usePlantFoodForSpeed(uint256 _tokenIdOfPlant) internal {
    plants[_tokenIdOfPlant].speed += 1;
  }

  function usePlantFood(uint256 _tokenIdOfPlant, uint8 _properties) public whenNotPaused() {
    require(ownerOf(_tokenIdOfPlant) == _msgSender(), "PlantVsZombieNFT: not is Owner of TokenId");
    require(_properties > 0,"PlantVsZombieNFT: _properties must be greater than 0");
    require(_properties < 6,"PlantVsZombieNFT: _properties must be less than 6");
    require(amountPlantFoodUserHaves[_msgSender()] > 0,"not enough PlantFood");
    if(_properties == 1) {
        require(plants[_tokenId].suncost - 10 >= 25,"PlantVsZombieNFT: suncost is already the minimum value");
        _usePlantFoodForSunCost(_tokenIdOfPlant);
    }
    else if(_properties == 2) {
        _usePlantFoodForDamage(_tokenIdOfPlant);
    }
    else if( _properties == 3) {
        _usePlantFoodForToughness(_tokenIdOfPlant);
    }
    else if(_properties == 4) {
        require(plants[_tokenIdOfPlant].recharge - 2 >= 2,"PlantVsZombieNFT: recharge is already the minimum value");
        _usePlantFoodForRecharge(_tokenId);
    }
    else if(_properties == 5) {
        _usePlantFoodForSpeed(_tokenIdOfPlant);
    }
    amountPlantFoodUserHaves[_msgSender()] -= 1;
    emit UsePlantFood(_msgSender(),_tokenIdOfPlant, _properties);
  }
}
