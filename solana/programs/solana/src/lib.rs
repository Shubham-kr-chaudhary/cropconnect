#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

declare_id!("CHA9kjfAW3wfJmouZhGGpttemR3P5G8uoJWEXfPHWDTq");

#[program]
pub mod solana {
    use super::*;

    pub fn confirm_order(
        ctx: Context<ConfirmOrder>,
        crop_name: String,
        quantity: u64,
        buyer: Pubkey,
    ) -> Result<()> {
        let order = &mut ctx.accounts.order;
        order.crop_name = crop_name;
        order.quantity  = quantity;
        order.buyer     = buyer;
        order.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ConfirmOrder<'info> {
    // this account will be created/initialized by the instruction
    #[account(init, payer = user, space = 8 + 4 + 64 + 8 + 32 + 8)]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Order {
    pub crop_name: String,
    pub quantity:  u64,
    pub buyer:     Pubkey,
    pub timestamp: i64,
}
