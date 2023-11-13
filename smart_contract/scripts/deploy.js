const main = async () => {
  const ProductsFactory = await hre.ethers.getContractFactory("ProductRatingSystem");
  const PRSContract = await ProductsFactory.deploy();

  await PRSContract.deployed();

  console.log("Transactions address: ", PRSContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();