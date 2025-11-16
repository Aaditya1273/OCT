module head_or_tail_game::game;

use one::object::{Self, UID};
use one::transfer;
use one::tx_context::{Self, TxContext};
use one::coin::{Self, Coin};
use one::oct::OCT;
use one::balance::{Self, Balance};
use one::event;
use one::random::{Self, Random};

// Error codes
const EInvalidBetAmount: u64 = 1;
const EInsufficientBalance: u64 = 2;
const ENotOwner: u64 = 3;

// Game configuration
const MIN_BET: u64 = 10_000_000; // 0.01 OCT (8 decimals)
const MAX_BET: u64 = 50_000_000; // 0.05 OCT
const RTP_MULTIPLIER: u64 = 170; // 1.7x (in basis points: 170/100)
const BONUS_MULTIPLIER: u64 = 220; // 2.2x
const BONUS_CHANCE: u8 = 4; // 4% chance

// Game state
public struct Game has key {
    id: UID,
    balance: Balance<OCT>,
    owner: address,
    total_head: u64,
    total_tail: u64,
    games_played: u64,
    rtp: u64,
    bonus: u64,
}

// Admin capability
public struct AdminCap has key, store {
    id: UID,
}

// Events
public struct GameResult has copy, drop {
    player: address,
    game_id: u64,
    is_winner: bool,
    bet_amount: u64,
    amount_won: u64,
    is_bonus: bool,
    is_head: bool,
}

// Initialize the game
fun init(ctx: &mut TxContext) {
    let admin_cap = AdminCap {
        id: object::new(ctx),
    };
    
    let game = Game {
        id: object::new(ctx),
        balance: balance::zero(),
        owner: tx_context::sender(ctx),
        total_head: 0,
        total_tail: 0,
        games_played: 0,
        rtp: RTP_MULTIPLIER,
        bonus: BONUS_MULTIPLIER,
    };
    
    transfer::share_object(game);
    transfer::transfer(admin_cap, tx_context::sender(ctx));
}

// Play the game
public entry fun play(
    game: &mut Game,
    bet_coin: Coin<OCT>,
    choice: bool, // true = head, false = tail
    r: &Random,
    ctx: &mut TxContext
) {
    let bet_amount = coin::value(&bet_coin);
    
    // Validate bet amount
    assert!(bet_amount >= MIN_BET && bet_amount <= MAX_BET, EInvalidBetAmount);
    
    // Check if game has enough balance to pay potential winnings
    let max_payout = (bet_amount * game.bonus) / 100;
    assert!(balance::value(&game.balance) >= max_payout, EInsufficientBalance);
    
    // Add bet to game balance
    let bet_balance = coin::into_balance(bet_coin);
    balance::join(&mut game.balance, bet_balance);
    
    // Generate random number
    let mut generator = random::new_generator(r, ctx);
    let random_number = random::generate_u8_in_range(&mut generator, 0, 99);
    
    // Determine result
    let result = (random_number % 2) == 0; // true = head, false = tail
    let is_winner = result == choice;
    let is_bonus = random_number < BONUS_CHANCE;
    
    // Update statistics
    if (result) {
        game.total_head = game.total_head + 1;
    } else {
        game.total_tail = game.total_tail + 1;
    };
    game.games_played = game.games_played + 1;
    
    let amount_won = if (is_winner) {
        let multiplier = if (is_bonus) { game.bonus } else { game.rtp };
        let payout = (bet_amount * multiplier) / 100;
        
        // Ensure we don't pay more than available
        let available = balance::value(&game.balance);
        let final_payout = if (payout > available) { available } else { payout };
        
        // Transfer winnings to player
        let win_balance = balance::split(&mut game.balance, final_payout);
        let win_coin = coin::from_balance(win_balance, ctx);
        transfer::public_transfer(win_coin, tx_context::sender(ctx));
        
        final_payout
    } else {
        0
    };
    
    // Emit event
    event::emit(GameResult {
        player: tx_context::sender(ctx),
        game_id: game.games_played,
        is_winner,
        bet_amount,
        amount_won,
        is_bonus,
        is_head: result,
    });
}

// Admin functions
public entry fun top_up_balance(
    game: &mut Game,
    _admin_cap: &AdminCap,
    payment: Coin<OCT>,
) {
    let payment_balance = coin::into_balance(payment);
    balance::join(&mut game.balance, payment_balance);
}

public entry fun withdraw_funds(
    game: &mut Game,
    admin_cap: &AdminCap,
    amount: u64,
    ctx: &mut TxContext
) {
    assert!(object::uid_to_address(&admin_cap.id) == game.owner, ENotOwner);
    
    let withdraw_balance = balance::split(&mut game.balance, amount);
    let withdraw_coin = coin::from_balance(withdraw_balance, ctx);
    transfer::public_transfer(withdraw_coin, game.owner);
}

public entry fun set_rtp(
    game: &mut Game,
    _admin_cap: &AdminCap,
    new_rtp: u64,
) {
    game.rtp = new_rtp;
}

public entry fun set_bonus(
    game: &mut Game,
    _admin_cap: &AdminCap,
    new_bonus: u64,
) {
    game.bonus = new_bonus;
}

// View functions
public fun get_balance(game: &Game): u64 {
    balance::value(&game.balance)
}

public fun get_total_head(game: &Game): u64 {
    game.total_head
}

public fun get_total_tail(game: &Game): u64 {
    game.total_tail
}

public fun get_games_played(game: &Game): u64 {
    game.games_played
}

public fun get_rtp(game: &Game): u64 {
    game.rtp
}

public fun get_bonus(game: &Game): u64 {
    game.bonus
}
