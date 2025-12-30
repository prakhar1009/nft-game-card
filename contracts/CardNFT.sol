// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CardNFT
 * @dev ERC-721 NFT Card Game Contract for Base Network
 * @notice This contract manages NFT cards with battle stats and progression
 * 
 * Features:
 * - Free starter pack (2 cards) for new players
 * - Paid minting (0.001 ETH per card)
 * - On-chain card stats (attack, defense, rarity, element)
 * - Battle result recording (XP, wins, losses)
 * - Player score tracking
 * - Rarity-based stat distribution
 */
contract CardNFT is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    
    // ============ Enums ============
    
    enum Rarity {
        COMMON,      // 50% chance
        RARE,        // 30% chance
        EPIC,        // 15% chance
        LEGENDARY    // 5% chance
    }
    
    enum Element {
        FIRE,
        WATER,
        EARTH,
        LIGHTNING,
        DARK,
        LIGHT
    }
    
    // ============ Structs ============
    
    struct CardStats {
        uint8 attack;        // 1-10
        uint8 defense;       // 1-10
        Rarity rarity;
        Element element;
        uint256 xp;          // Experience points
        uint256 wins;        // Total wins
        uint256 losses;      // Total losses
        uint256 mintedAt;    // Timestamp of mint
    }
    
    // ============ State Variables ============
    
    uint256 private _tokenIdCounter;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 public constant STARTER_PACK_SIZE = 2;
    
    // Mappings
    mapping(uint256 => CardStats) public cardStats;
    mapping(address => bool) public hasClaimedStarter;
    mapping(address => uint256) public playerScore;
    
    // ============ Events ============
    
    event StarterPackClaimed(address indexed player, uint256[] tokenIds);
    event CardMinted(address indexed player, uint256 indexed tokenId, Rarity rarity, Element element);
    event CardBattled(uint256 indexed tokenId, bool won, uint256 xpGained);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    // ============ Constructor ============
    
    constructor() ERC721("Battle Card NFT", "BCARD") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start from token ID 1
    }
    
    // ============ Minting Functions ============
    
    /**
     * @dev Claim free starter pack (2 Common cards)
     * @notice Can only be claimed once per address
     */
    function claimStarterPack() external nonReentrant {
        require(!hasClaimedStarter[msg.sender], "Starter pack already claimed");
        require(_tokenIdCounter + STARTER_PACK_SIZE <= MAX_SUPPLY, "Max supply reached");
        
        hasClaimedStarter[msg.sender] = true;
        
        uint256[] memory tokenIds = new uint256[](STARTER_PACK_SIZE);
        
        for (uint256 i = 0; i < STARTER_PACK_SIZE; i++) {
            uint256 tokenId = _tokenIdCounter++;
            tokenIds[i] = tokenId;
            
            _safeMint(msg.sender, tokenId);
            
            // Generate starter card (always Common, balanced stats)
            cardStats[tokenId] = CardStats({
                attack: _randomInRange(tokenId, 4, 6),
                defense: _randomInRange(tokenId + 1, 4, 6),
                rarity: Rarity.COMMON,
                element: _randomElement(tokenId),
                xp: 0,
                wins: 0,
                losses: 0,
                mintedAt: block.timestamp
            });
            
            emit CardMinted(msg.sender, tokenId, Rarity.COMMON, cardStats[tokenId].element);
        }
        
        emit StarterPackClaimed(msg.sender, tokenIds);
    }
    
    /**
     * @dev Mint a random card for 0.001 ETH
     * @notice Rarity is determined by weighted randomization
     */
    function mintCard() external payable nonReentrant {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(_tokenIdCounter <= MAX_SUPPLY, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        
        // Generate random card stats
        Rarity rarity = _randomRarity(tokenId);
        Element element = _randomElement(tokenId);
        
        // Calculate stats based on rarity
        (uint8 attack, uint8 defense) = _generateStats(tokenId, rarity);
        
        cardStats[tokenId] = CardStats({
            attack: attack,
            defense: defense,
            rarity: rarity,
            element: element,
            xp: 0,
            wins: 0,
            losses: 0,
            mintedAt: block.timestamp
        });
        
        emit CardMinted(msg.sender, tokenId, rarity, element);
        
        // Refund excess payment
        if (msg.value > MINT_PRICE) {
            (bool success, ) = msg.sender.call{value: msg.value - MINT_PRICE}("");
            require(success, "Refund failed");
        }
    }
    
    // ============ Battle Functions ============
    
    /**
     * @dev Record battle result and update card stats
     * @param tokenId The card that battled
     * @param won Whether the battle was won
     * @param xpGained XP earned from battle
     */
    function recordBattle(uint256 tokenId, bool won, uint256 xpGained) external {
        require(ownerOf(tokenId) == msg.sender, "Not card owner");
        require(xpGained <= 1000, "XP gain too high"); // Prevent abuse
        
        CardStats storage stats = cardStats[tokenId];
        stats.xp += xpGained;
        
        if (won) {
            stats.wins++;
            playerScore[msg.sender] += xpGained;
        } else {
            stats.losses++;
        }
        
        emit CardBattled(tokenId, won, xpGained);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get all token IDs owned by a player
     * @param player Address of the player
     * @return Array of token IDs
     */
    function getPlayerCards(address player) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(player);
        uint256[] memory tokenIds = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(player, i);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get stats for a specific card
     * @param tokenId Token ID of the card
     * @return CardStats struct
     */
    function getCardStats(uint256 tokenId) external view returns (CardStats memory) {
        require(_ownerOf(tokenId) != address(0), "Card does not exist");
        return cardStats[tokenId];
    }
    
    /**
     * @dev Get current token counter
     * @return Current token ID counter
     */
    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Get total cards minted
     * @return Number of cards minted
     */
    function getTotalMinted() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    /**
     * @dev Check if address has claimed starter pack
     * @param player Address to check
     * @return Boolean indicating if starter was claimed
     */
    function hasPlayerClaimedStarter(address player) external view returns (bool) {
        return hasClaimedStarter[player];
    }
    
    // ============ Internal Functions ============
    
    /**
     * @dev Generate random rarity based on distribution
     * Distribution: Common 50%, Rare 30%, Epic 15%, Legendary 5%
     */
    function _randomRarity(uint256 seed) private view returns (Rarity) {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            seed
        ))) % 100;
        
        if (random < 50) return Rarity.COMMON;      // 0-49: 50%
        if (random < 80) return Rarity.RARE;        // 50-79: 30%
        if (random < 95) return Rarity.EPIC;        // 80-94: 15%
        return Rarity.LEGENDARY;                     // 95-99: 5%
    }
    
    /**
     * @dev Generate random element
     */
    function _randomElement(uint256 seed) private view returns (Element) {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            seed,
            "element"
        ))) % 6;
        
        return Element(random);
    }
    
    /**
     * @dev Generate stats based on rarity
     * Rarity multipliers: Common 1.0x, Rare 1.3x, Epic 1.6x, Legendary 2.0x
     */
    function _generateStats(uint256 seed, Rarity rarity) private view returns (uint8, uint8) {
        uint8 baseAttack = _randomInRange(seed, 3, 7);
        uint8 baseDefense = _randomInRange(seed + 1, 3, 7);
        
        uint8 attack;
        uint8 defense;
        
        if (rarity == Rarity.COMMON) {
            attack = baseAttack;
            defense = baseDefense;
        } else if (rarity == Rarity.RARE) {
            attack = _min(10, (baseAttack * 13) / 10);  // 1.3x
            defense = _min(10, (baseDefense * 13) / 10);
        } else if (rarity == Rarity.EPIC) {
            attack = _min(10, (baseAttack * 16) / 10);  // 1.6x
            defense = _min(10, (baseDefense * 16) / 10);
        } else { // LEGENDARY
            attack = _min(10, baseAttack * 2);           // 2.0x
            defense = _min(10, baseDefense * 2);
        }
        
        // Ensure minimum of 1
        attack = attack == 0 ? 1 : attack;
        defense = defense == 0 ? 1 : defense;
        
        return (attack, defense);
    }
    
    /**
     * @dev Generate random number in range [min, max]
     */
    function _randomInRange(uint256 seed, uint8 min, uint8 max) private view returns (uint8) {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            seed
        ))) % (max - min + 1);
        
        return uint8(random + min);
    }
    
    /**
     * @dev Return minimum of two numbers
     */
    function _min(uint8 a, uint8 b) private pure returns (uint8) {
        return a < b ? a : b;
    }
    
    // ============ Owner Functions ============
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    // ============ Required Overrides ============
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
