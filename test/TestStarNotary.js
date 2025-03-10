const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;
var instance;
var user1;
var user2;


contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});
describe('Test Group', function () {

    beforeEach(async () => {
        instance = await StarNotary.deployed();
        user1 = accounts[1];
        user2 = accounts[2];

    });
it('can Create a Star', async() => {
    let tokenId = 1;
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {

    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {

    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {  

    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);   
    let starPriceEther= web3.utils.fromWei(String(starPrice), "ether");
    let valueEther= web3.utils.fromWei(String(value), "ether");
    assert.equal(Number(valueEther).toFixed(2),Number(starPriceEther));
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
     // 1. create a Star with different tokenId
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
        let tokenId = 6;
        await instance.createStar('New Star!', tokenId, {from: accounts[0]});
        assert.equal(await instance.name.call(), "Star Registry");
        assert.equal(await instance.symbol.call(), "SRT");
    
});

it('lets 2 users exchange stars', async() => {

    let starId = 7;
    let starId2 = 8;

     // 1. create 2 Stars with different tokenId
    await instance.createStar('StarOne',starId, {from: user1});
    await instance.createStar('StarTwo',starId2, {from: user2});
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(starId,starId2);
    let star1 = await instance.ownerOf.call(starId);
    let star2 = await instance.ownerOf.call(starId2);
    // 3. Verify that the owners changed
    assert.equal(star1,user2);
    assert.equal(star2,user1);
});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
    let starId = 9;
    // 1. create a Star
    await instance.createStar('StarOne',starId, {from: user1});
    // 2. use the transferStar function implemented in the Smart Contract
    await instance.transferStar(user2,starId, {from: user1});
    // 3. Verify the star owner changed.
    let stars = await instance.ownerOf.call(starId);
    assert.equal(stars,user2);

});

it('lookUptokenIdToStarInfo test', async() => {
    
    let tokenId = 10;
    // 1. create a Star with different tokenId
    await instance.createStar('Amazing Star!', tokenId, {from: accounts[1]});

    // check star name lookup is correct
    assert.equal(await instance.lookUptokenIdToStarInfo(tokenId), "Amazing Star!");
    // 1. create a Star with different tokenId
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
});

});
