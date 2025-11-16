module snakes_game::snakes;

use one::coin::{Self, Coin};
use one::balance::{Self, Balance};
use one::oct::OCT;
use one::tx_context::{Self, TxContext};
use one::transfer;
use one::object::{Self, UID};
use std::string::String;

// Game state object
public struct Game has key {
    id: UID,
    balance: Balance<OCT>,
    owner: address,
    games_played: u64,
}

// Events
public struct BetPlaced has copy, drop {
    player: address,
    nickname: String,
    amount: u64,
}

public struct GameResult has copy, drop {
    player: address,
    nickname: String,
    bet_amount: u64,
    payout: u64,
    multiplier: u64,
    won: bool,
}

// Initialize the game
fun init(ctx: &mut TxContext) {
    let game = Game {
        id: object::new(ctx),
        balance: balance::zero(),
        owner: tx_context::sender(ctx),
        games_played: 0,
    };
    transfer::share_object(game);
}

// Place bet and receive payout immediately
public entry fun play(
    game: &mut Game,
    payment: Coin<OCT>,
    nickname: String,
    multiplier_basis_points: u64, // e.g., 200 = 2.00x
    won: bool,
    ctx: &mut TxContext
) {
    let bet_amount = coin::value(&payment);
    assert!(bet_amount > 0, 0);
    
    let player = tx_context::sender(ctx);
    
    // Add bet to game balance
    let payment_balance = coin::into_balance(payment);
    balance::join(&mut game.balance, payment_balance);
    
    game.games_played = game.games_played + 1;
    
    // Emit bet placed event
    one::event::emit(BetPlaced {
        player,
        nickname: nickname,
        amount: bet_amount,
    });
    
    // If won, calculate and pay out
    let payout = if (won) {
        let calculated_payout = (bet_amount * multiplier_basis_points) / 100;
        let available = balance::value(&game.balance);
        let final_payout = if (calculated_payout > available) { available } else { calculated_payout };
        
        if (final_payout > 0) {
            let win_balance = balance::split(&mut game.balance, final_payout);
            let win_coin = coin::from_balance(win_balance, ctx);
            transfer::public_transfer(win_coin, player);
        };
        
        final_payout
    } else {
        0
    };
    
    // Emit game result event
    one::event::emit(GameResult {
        player,
        nickname,
        bet_amount,
        payout,
        multiplier: multiplier_basis_points,
        won,
    });
}

// Owner functions
public entry fun deposit(
    game: &mut Game,
    payment: Coin<OCT>,
) {
    let payment_balance = coin::into_balance(payment);
    balance::join(&mut game.balance, payment_balance);
}

public entry fun withdraw(
    game: &mut Game,
    amount: u64,
    ctx: &mut TxContext
) {
    assert!(tx_context::sender(ctx) == game.owner, 1);
    assert!(amount > 0, 2);
    assert!(balance::value(&game.balance) >= amount, 3);
    
    let withdrawal = balance::split(&mut game.balance, amount);
    let withdraw_coin = coin::from_balance(withdrawal, ctx);
    transfer::public_transfer(withdraw_coin, game.owner);
}

// View functions
public fun get_balance(game: &Game): u64 {
    balance::value(&game.balance)
}

public fun get_games_played(game: &Game): u64 {
    game.games_played
}
