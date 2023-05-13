const { ethers } = require("hardhat");
const { expect } = require("chai");
const { JsonRpcProvider } = require("@ethersproject/providers");

describe("Escrow contract", function () {
  let escrow;
  let owner;

  beforeEach(async function () {
    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(1); // passing the constructor argument here
    await escrow.deployed();
    [owner] = await ethers.getSigners();
  });

  it("should create a new item", async function () {
    const purpose = "Buy a car";
    const amount = ethers.utils.parseEther("1");

    const tx = await escrow.createItem(purpose, {
      value: amount,
    });

    await tx.wait();

    const items = await escrow.getItems();
    const item = items[0];

    expect(items.length).to.equal(1);
    expect(item.purpose).to.equal(purpose);
    expect(item.amount).to.equal(amount);
    expect(item.owner).to.equal(await owner.getAddress()); // using owner here
    expect(item.status).to.equal("OPEN");
  });
});
