const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('PlantVsZombieNFT', function() {

    let totalSupplyPlantCoin = 1e6;
    let subscriptionIdDefault = 670;
    let [plantVsZombieNFT, plantCoin, box] = [];
    let imcrementBoxDefault = 100;
    let imcrementBoxVipDefault = 100;
    let imcremetnPlantFoodDefault = 100;
    let priceOfBoxDefault = 50;
    let priceOfBoxVipDefault = 100;
    let priceOfPlantFoodDefault = 20;
    let priceTransferPlantCoinDefault = 1000;
    let priceApprovePlantCoinDefault = 500;
    let amountPlantFoodBuyAmount = 1;
    let amountBoxBuyDefault = 2;
    let tokenIdOfBoxVip = 1;
    let tokenIdOfBox = 2;

    beforeEach( async() => {
        ;[admin, buyer, address2 ] = await ethers.getSigners();
        const PlantVsZombieNFT = await ethers.getContractFactory('PlantVsZombieNFT');
        const PlantCoin = await ethers.getContractFactory('PlantCoin');
        const Box = await ethers.getContractFactory('Box');

        plantVsZombieNFT = await PlantVsZombieNFT.deploy('PlantVsZombieNFT','khongco',subscriptionIdDefault);
        plantCoin = await PlantCoin.deploy(totalSupplyPlantCoin);
        box = await Box.deploy(plantVsZombieNFT.address, "uri");
    })

    describe('#setAddressOfCoinUse', function() {
        it('revert if not pause', async function() {
            await plantVsZombieNFT.unpause();
            await expect(plantVsZombieNFT.setAddressOfCoinUse(plantCoin.address)).to.be.revertedWith("Pausable: not paused");
        })

        it('revert if not owner',async function() {
            await expect(plantVsZombieNFT.connect(address1).setAddressOfCoinUse(plantCoin.address)).to.be.revertedWith("Ownable: caller is not the owner")
        })

        it('setAddressOfCoinUse successfully',async function() {
            const setAddressOfCoinUseExample = await plantVsZombieNFT.setAddressOfCoinUse(plantCoin.address);
            await expect(setAddressOfCoinUseExample).to.be.emit(plantVsZombieNFT,'UpdateAddressOfCoinUse').withArgs(plantCoin.address);
            expect(await plantVsZombieNFT.getAddressOfCoinUse()).to.be.equal(plantCoin.address);
        })
    })

    describe('#setAddressOfBox', function() {
        it('setAddressOfBox successfully', async function() {
            const setAddressOfBoxExample = await plantVsZombieNFT.setAddressOfBox(box.address);
            await expect(setAddressOfBoxExample).to.be.emit(plantVsZombieNFT, 'UpdateAddressBoxUse').withArgs(box.address);
            expect(await plantVsZombieNFT.getAddressOfBoxContractUse()).to.be.equal(box.address);
        })
    })

    describe('#imcrementBox', function() {

        it('revert if amount < 0', async function() {
            await expect(plantVsZombieNFT.imcrementBox(0)).to.be.revertedWith("PlantVsZombieNFT: amount must be greater than zero");
        })

        it('imcrementBox successfully', async function() {
            const imcrementBoxExample = await plantVsZombieNFT.imcrementBox(imcrementBoxDefault);
            await expect(imcrementBoxExample).to.be.emit(plantVsZombieNFT, 'ImcrementBox').withArgs(imcrementBoxDefault);
            expect( await plantVsZombieNFT.getAmountBox()).to.be.equal(imcrementBoxDefault);
        })

    })

    describe('#imcrementBoxVip', function() {
        it('revert if amount < 0', async function() {
            await expect(plantVsZombieNFT.imcrementBoxVip(0)).to.be.revertedWith("PlantVsZombieNFT: amount must be greater than zero");
        })

        it('imcrementBoxVip successfully', async function() {
            const imcrementBoxVipExample = await plantVsZombieNFT.imcrementBoxVip(imcrementBoxDefault);
            await expect(imcrementBoxVipExample).to.be.emit(plantVsZombieNFT, 'ImcrementBoxVip').withArgs(imcrementBoxDefault);
            expect( await plantVsZombieNFT.getAmountBoxVip()).to.be.equal(imcrementBoxDefault);
        })
    })

    describe('#imcrementPlantFood', function() {
        it('revert if amount < 0', async function() {
            await expect(plantVsZombieNFT.imcrementPlantFood(0)).to.be.revertedWith("PlantVsZombieNFT: amount must be greater than zero");
        })

        it('imcrementPlantFood successfully', async function() {
            const imcrementPlantFoodExample = await plantVsZombieNFT.imcrementPlantFood(imcremetnPlantFoodDefault);
            await expect( imcrementPlantFoodExample).to.be.emit(plantVsZombieNFT,'ImcrementPlantFood').withArgs(imcremetnPlantFoodDefault);
            expect( await plantVsZombieNFT.getPlantFood()).to.be.equal(imcremetnPlantFoodDefault);
        })
    })

    describe('#setPriceOfBox', function() {
        it('setPriceOfBox successfully', async function() {
            const setPriceOfBoxExample = await plantVsZombieNFT.setPriceOfBox(priceOfBoxDefault);
            await expect( setPriceOfBoxExample).to.be.emit(plantVsZombieNFT, 'UpdatePriceOfBox').withArgs(0, priceOfBoxDefault);
            expect( await plantVsZombieNFT.getPriceOfBox()).to.be.equal(priceOfBoxDefault);
        })
    })

    describe('#setPriceOfBoxVip', function() {
        it('setPriceOfBoxVip successfully', async function() {
            const setPriceOfBoxVipExample = await plantVsZombieNFT.setPriceOfBoxVip(priceOfBoxVipDefault);
            await expect( setPriceOfBoxVipExample).to.be.emit(plantVsZombieNFT, 'UpdatePriceOfBoxVip').withArgs(0, priceOfBoxVipDefault);
            expect( await plantVsZombieNFT.getPriceOfBoxVip()).to.be.equal(priceOfBoxVipDefault);
        })
    })

    describe('#setPriceOfPlantFood', function() {
        it('setPriceOfPlantFood successfully', async function() {
            const setPriceOfPlantFoodExample = await plantVsZombieNFT.setPriceOfPlantFood(priceOfPlantFoodDefault);
            await expect( setPriceOfPlantFoodExample).to.be.emit(plantVsZombieNFT,'UpdatePriceOfPlantFood').withArgs(0,priceOfPlantFoodDefault);
            expect(await plantVsZombieNFT.getPriceOfPlantFood()).to.be.equal(priceOfPlantFoodDefault);
        })
    })

    describe('#unpause', function() {
        it('unpause successfully', async function() {
            const unpauseExample = await plantVsZombieNFT.unpause();
            await expect( unpauseExample).to.be.emit(plantVsZombieNFT,'Unpaused').withArgs(admin.address);
            expect(await plantVsZombieNFT.paused()).to.be.equal(false);
        })
    })

    describe('#pause', function() {
        it('pause successfully', async function() {
            await plantVsZombieNFT.unpause();
            const pauseExample = await plantVsZombieNFT.pause();
            await expect( pauseExample).to.be.emit(plantVsZombieNFT,'Paused').withArgs(admin.address);
            expect(await plantVsZombieNFT.paused()).to.be.equal(true);
        })
    })

    describe('#ableBuyBoxVip', function() {
        it('ableBuyBoxVip successfully', async function() {
            const ableBuyBoxVipExample = await plantVsZombieNFT.ableBuyBoxVip();
            expect(await plantVsZombieNFT.getAbleBuyBoxVip()).to.be.equal(true);
        })
    })

    describe('#unableBuyBoxVip', function() {
        it('unableBuyBoxVip successfully', async function() {
            await plantVsZombieNFT.ableBuyBoxVip();
            const unableBuyBoxVip = await plantVsZombieNFT.unableBuyBoxVip();
            expect(await plantVsZombieNFT.getAbleBuyBoxVip()).to.be.equal(false);
        })
    })

    describe('#buyBox', function() {
        it('revert if paused', async function() {
            await expect(plantVsZombieNFT.connect(buyer).buyBox(false, 1)).to.be.revertedWith('Pausable: paused');
        })

        it('revert if amountBox < amountBoxBuy', async function() {
            await plantVsZombieNFT.unpause();
            await expect(plantVsZombieNFT.connect(buyer).buyBox(false,1)).to.be.revertedWith("PlantVsZombieNFT: amountBoxVip Supply must be greater than amountBoxBuy")
        })
        
        it('buyBox successfully', async function() {
            const amountBuyBoxExample = 1;
            await plantVsZombieNFT.setPriceOfBox(priceOfBoxDefault);
            await plantVsZombieNFT.setAddressOfCoinUse(plantCoin.address);
            await plantVsZombieNFT.setAddressOfBox(box.address);
            await plantVsZombieNFT.imcrementBox(imcrementBoxDefault);
            await plantCoin.transfer(buyer.address, priceTransferPlantCoinDefault);
            await plantCoin.connect(buyer).approve(plantVsZombieNFT.address, priceApprovePlantCoinDefault);
            await plantVsZombieNFT.unpause();
            const buyBoxExample = await plantVsZombieNFT.connect(buyer).buyBox(false, amountBuyBoxExample);
            await expect(buyBoxExample).to.emit(plantVsZombieNFT,'BuyBox').withArgs(buyer.address, false, amountBuyBoxExample);
            expect(await plantVsZombieNFT.getAmountBox()).to.be.equal(imcrementBoxDefault - amountBuyBoxExample);
            expect(await box.balanceOf(buyer.address, tokenIdOfBox)).to.be.equal(amountBuyBoxExample);
        })

        it('revert if amountBoxVip < amountBoxBuy', async function() {
            await plantVsZombieNFT.unpause();
            await expect(plantVsZombieNFT.connect(buyer).buyBox(true,1)).to.be.rejectedWith("PlantVsZombieNFT: amountBoxVip Supply must be greater than amountBoxBuy"); 
        })

        it('revert if unableBuyBoxVip', async function() {
            await plantVsZombieNFT.imcrementBoxVip(imcrementBoxVipDefault);
            await plantVsZombieNFT.unpause();
            await expect(plantVsZombieNFT.connect(buyer).buyBox(true,1)).to.be.rejectedWith("PlantVsZombieNFT: must able Buy Box Vip"); 
        }) 

        it('buyBoxVip successfully', async function() {
            const amountBuyBoxVipExample = 1;
            await plantVsZombieNFT.setPriceOfBoxVip(priceOfBoxVipDefault);
            await plantVsZombieNFT.setAddressOfCoinUse(plantCoin.address);
            await plantVsZombieNFT.setAddressOfBox(box.address);
            await plantVsZombieNFT.imcrementBoxVip(imcrementBoxVipDefault);
            await plantCoin.transfer(buyer.address, priceTransferPlantCoinDefault);
            await plantCoin.connect(buyer).approve(plantVsZombieNFT.address, priceApprovePlantCoinDefault);
            await plantVsZombieNFT.unpause();
            await plantVsZombieNFT.ableBuyBoxVip();
            const buyBoxExample = await plantVsZombieNFT.connect(buyer).buyBox(true, amountBuyBoxVipExample);
            await expect(buyBoxExample).to.emit(plantVsZombieNFT,'BuyBox').withArgs(buyer.address, true, amountBuyBoxVipExample);
            expect(await plantVsZombieNFT.getAmountBoxVip()).to.be.equal(imcrementBoxDefault - amountBuyBoxVipExample);
            expect(await box.balanceOf(buyer.address, tokenIdOfBoxVip)).to.be.equal(amountBuyBoxVipExample);
        })
    })

    describe('#buyPlantFood', function() {
        it('revert if paused', async function() {
            await expect(plantVsZombieNFT.connect(buyer).buyPlantFood(amountPlantFoodBuyAmount)).to.be.revertedWith('Pausable: paused');
        })
        
        it('revert if amountPlantFoodBuy <= 0', async function() {
            plantVsZombieNFT.unpause();
            await expect(plantVsZombieNFT.connect(buyer).buyPlantFood(0)).to.be.revertedWith("PlantVsZombieNFT: amountFlantFoodBuy must be greater than zero");
        })

        it('revert if amountPlantFood <= amountPlantFoodBuy',async function() {
            plantVsZombieNFT.unpause();
            await expect(plantVsZombieNFT.connect(buyer).buyPlantFood(1)).to.be.revertedWith("PlantVsZombieNFT: amountFlantFood Suppoly must be greater than amountPlantFoodBuy");
        })

        it('buyPlantFood successfully', async function() {
            const amountPlantFoodBuyExample = 1;
            await plantVsZombieNFT.setAddressOfCoinUse(plantCoin.address);
            await plantVsZombieNFT.setAddressOfBox(box.address);
            await plantVsZombieNFT.imcrementPlantFood(imcremetnPlantFoodDefault);
            await plantVsZombieNFT.setPriceOfPlantFood(priceOfPlantFoodDefault);
            await plantCoin.transfer(buyer.address, priceTransferPlantCoinDefault);
            await plantCoin.connect(buyer).approve(plantVsZombieNFT.address, priceApprovePlantCoinDefault);
            await plantVsZombieNFT.unpause();
            const buyPlantFoodExample = await plantVsZombieNFT.connect(buyer).buyPlantFood(amountPlantFoodBuyExample);
            await expect(buyPlantFoodExample).to.be.emit(plantVsZombieNFT, 'BuyPlantFood').withArgs(buyer.address, amountPlantFoodBuyExample);
            expect(await plantVsZombieNFT.getAmountPlantFoodUserHaves(buyer.address)).to.be.equal(amountPlantFoodBuyExample);
            expect(await plantVsZombieNFT.getPlantFood()).to.be.equal(imcremetnPlantFoodDefault - amountPlantFoodBuyExample);
        })
    })

    describe('#updatePlantRule', function() {
        const arrayExample = [
            [25, 30, 600],
            [20, 200, 1000],
            [200, 500, 5000],
            [1, 15, 30],
            [1, 4, 7],
        ];

        it('revert if unpaused',async function() {
            await plantVsZombieNFT.unpause();
            await expect(plantVsZombieNFT.updatePlantRule(arrayExample)).to.be.revertedWith("Pausable: not paused");
        })

        it('revert if not owner', async function() {
            await expect(plantVsZombieNFT.connect(buyer).updatePlantRule(arrayExample)).to.be.revertedWith("Ownable: caller is not the owner");
        })

        it('updatePlantRule sucessfully',async function() {
            const updatePlantRuleExample = plantVsZombieNFT.updatePlantRule(arrayExample);
            expect(updatePlantRuleExample).to.be.emit(plantVsZombieNFT,'UpdatePlantRule').withArgs(arrayExample);
            expect(await plantVsZombieNFT.getPlantRule()).to.be.deep.equal(arrayExample);
        })
    }) 

    describe('#unBox', function() {
        it('revert if the user does not have a box', async function() {
            //const amountBuyBoxExample = 1;
            await plantVsZombieNFT.setPriceOfBox(priceOfBoxDefault);
            await plantVsZombieNFT.setAddressOfCoinUse(plantCoin.address);
            await plantVsZombieNFT.setAddressOfBox(box.address);
            await plantVsZombieNFT.imcrementBox(imcrementBoxDefault);
            await plantCoin.transfer(buyer.address, priceTransferPlantCoinDefault);
            await plantCoin.connect(buyer).approve(plantVsZombieNFT.address, priceApprovePlantCoinDefault);
            await plantVsZombieNFT.unpause();
            expect(plantVsZombieNFT.unBox(false, "PlantName")).to.be.revertedWith("PlantVsZombieNFT: amount box of user must be greate than zero");
        })

        it('revert if the user does not have a boxVip', async function() {
            const amountBuyBoxVipExample = 1;
            await plantVsZombieNFT.setPriceOfBoxVip(priceOfBoxVipDefault);
            await plantVsZombieNFT.setAddressOfCoinUse(plantCoin.address);
            await plantVsZombieNFT.setAddressOfBox(box.address);
            await plantVsZombieNFT.imcrementBoxVip(imcrementBoxVipDefault);
            await plantCoin.transfer(buyer.address, priceTransferPlantCoinDefault);
            await plantCoin.connect(buyer).approve(plantVsZombieNFT.address, priceApprovePlantCoinDefault);
            await plantVsZombieNFT.unpause();
            expect(plantVsZombieNFT.unBox(true, "PlantName")).to.be.revertedWith("PlantVsZombieNFT: amount box Vip of user must be greate than zero");
        })

        it('UnBox successfully', async function() {
            const amountBuyBoxExample = 1;
            await plantVsZombieNFT.setPriceOfBox(priceOfBoxDefault);
            await plantVsZombieNFT.setAddressOfCoinUse(plantCoin.address);
            await plantVsZombieNFT.setAddressOfBox(box.address);
            await plantVsZombieNFT.imcrementBox(imcrementBoxDefault);
            await plantCoin.transfer(buyer.address, priceTransferPlantCoinDefault);
            await plantCoin.connect(buyer).approve(plantVsZombieNFT.address, priceApprovePlantCoinDefault);
            await plantVsZombieNFT.unpause();
            await plantVsZombieNFT.connect(buyer).buyBox(false, amountBuyBoxExample);
            const unBoxExample = await plantVsZombieNFT.connect(buyer).unBox(false, "plant Name");
            //await expect(unBoxExample).to.be.emit(plantVsZombieNFT,'UnBox').withArgs(buyer.address,false);

        })
        
        it('UnBoxVip successfully', async function() {
            const amountPlantFoodBuyExample = 1;
            await plantVsZombieNFT.setPriceOfBox(priceOfBoxDefault);
            await plantVsZombieNFT.setAddressOfCoinUse(plantCoin.address);
            await plantVsZombieNFT.setAddressOfBox(box.address);
            await plantVsZombieNFT.imcrementBox(imcrementBoxDefault);
            await plantCoin.transfer(buyer.address, priceTransferPlantCoinDefault);
            await plantCoin.connect(buyer).approve(plantVsZombieNFT.address, priceApprovePlantCoinDefault);
            await plantVsZombieNFT.unpause();
            await plantVsZombieNFT.connect(buyer).buyBox(true, amountBuyBoxVipExample);
        })
    })


    

})