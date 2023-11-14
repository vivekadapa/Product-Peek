// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRatingSystem {
    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    struct Review {
        address reviewer;
        string ipfsContentHash;
        uint8 rating;
        uint256 timestamp;
        string oneWordReview; // New attribute for one-word review
    }

    struct Product {
        string name;
        string description;
        uint256 totalReviews;
        string productUrl;
        Review[] reviews;
        mapping(address => uint256) userReviewIndexes;
    }

    struct ProductDetails {
        uint256 productId;
        string name;
        string description;
        uint8 rating;
        uint256 totalReviews;
        string productUrl;
    }

    uint256 numProducts;
    mapping(uint256 => Product) products;
    mapping(address => uint256) public lastReviewTimestamp;
    uint256 public reviewCooldownTime = 10 seconds;
    event ProductAdded(
        uint256 productId,
        string name,
        string description,
        string productUrl
    );
    event ReviewAdded(
        uint256 productId,
        address reviewer,
        string ipfsContentHash,
        uint8 rating,
        string oneWordReview
    );
    event ReviewDeleted(uint256 productId, address reviewer, uint256 reviewId);
    event ProductDeleted(uint256 productId);

    constructor() {
        admin = msg.sender;
    }

    function addProduct(
        string memory name,
        string memory description,
        string memory productUrl
    ) public onlyAdmin {
        Product storage product = products[numProducts++];
        product.name = name;
        product.description = description;
        product.productUrl = productUrl;
        product.totalReviews = 0;
        emit ProductAdded(numProducts - 1, name, description, productUrl);
    }

  function addReview(
        uint256 productId,
        string memory ipfsContentHash,
        uint8 rating,
        string memory oneWordReview
    ) public {
        require(productId < numProducts, "Product does not exist");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        Product storage product = products[productId];
        require(
            product.userReviewIndexes[msg.sender] == 0,
            "You have already reviewed this product"
        );

        require(
            block.timestamp - lastReviewTimestamp[msg.sender] >=
                reviewCooldownTime,
            "You can't submit another review yet"
        );
        lastReviewTimestamp[msg.sender] = block.timestamp;

        uint256 reviewId = product.reviews.length;
        product.reviews.push(
            Review(
                msg.sender,
                ipfsContentHash,
                rating,
                block.timestamp,
                oneWordReview
            )
        );
        product.userReviewIndexes[msg.sender] = reviewId;
        product.totalReviews++;

        emit ReviewAdded(
            productId,
            msg.sender,
            ipfsContentHash,
            rating,
            oneWordReview
        );
    }

    function deleteReview(uint256 productId) public {
        require(productId < numProducts, "Product does not exist");
        Product storage product = products[productId];
        uint256 reviewId = product.userReviewIndexes[msg.sender];
        require(reviewId > 0, "You have no review for this product");

        delete product.reviews[reviewId - 1];
        delete product.userReviewIndexes[msg.sender];
        product.totalReviews--;

        emit ReviewDeleted(productId, msg.sender, reviewId);
    }

    function deleteProduct(uint256 productId) public onlyAdmin {
        require(productId < numProducts, "Product does not exist");
        Product storage product = products[productId];

        for (uint256 i = 0; i < product.reviews.length; i++) {
            // Mark reviews for deletion, but don't actually delete them
            product.reviews[i].reviewer = address(0); // Set the reviewer address to a known "empty" value
            product.reviews[i].ipfsContentHash = ""; // Clear the content hash
            product.reviews[i].rating = 0; // Reset the rating
        }
        delete products[productId];
        emit ProductDeleted(productId);
    }

    function getAverageRating(uint256 productId) public view returns (uint8) {
        require(productId < numProducts, "Product does not exist");
        Product storage product = products[productId];

        if (product.totalReviews == 0) {
            return 0;
        }

        uint256 totalStars = 0;
        for (uint256 i = 0; i < product.reviews.length; i++) {
            totalStars += product.reviews[i].rating;
        }

        return uint8(totalStars / product.totalReviews);
    }

    function getProductReviews(uint256 productId)
        public
        view
        returns (Review[] memory)
    {
        require(productId < numProducts, "Product does not exist");
        Product storage product = products[productId];
        return product.reviews;
    }

    function getProductDetails(uint256 productId)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            uint8
        )
    {
        require(productId < numProducts, "Product does not exist");
        Product storage product = products[productId];
        return (
            product.name,
            product.description,
            product.totalReviews,
            product.productUrl,
            getAverageRating(productId)
        );
    }

    function getProductsCount() public view returns (uint256) {
        return numProducts;
    }

    function getProductById(uint256 productId)
        public
        view
        returns (
            string memory name,
            string memory description,
            uint256 totalReviews,
            string memory productUrl,
            uint8 averageRating
        )
    {
        require(productId < numProducts, "Product does not exist");
        Product storage product = products[productId];
        name = product.name;
        description = product.description;
        totalReviews = product.totalReviews;
        productUrl = product.productUrl;
        averageRating = getAverageRating(productId);
    }

    function getAllProducts() public view returns (ProductDetails[] memory) {
        ProductDetails[] memory productDetails = new ProductDetails[](
            numProducts
        );
        for (uint256 i = 0; i < numProducts; i++) {
            Product storage product = products[i];
            uint8 averageRating = getAverageRating(i);
            productDetails[i] = ProductDetails({
                productId: i,
                name: product.name,
                description: product.description,
                rating: averageRating,
                totalReviews: product.totalReviews,
                productUrl: product.productUrl
            });
        }
        return productDetails;
    }

    function getReviewCoolDownTime() public view returns (uint256) {
        return reviewCooldownTime;
    }

    function getRemainingTimeForReview() public view returns (uint256) {
        uint256 lastReviewTime = lastReviewTimestamp[msg.sender];
        uint256 elapsedTime = block.timestamp - lastReviewTime;

        if (elapsedTime >= reviewCooldownTime) {
            return 0; // User can submit a review now
        } else {
            return reviewCooldownTime - elapsedTime;
        }
    }
}
