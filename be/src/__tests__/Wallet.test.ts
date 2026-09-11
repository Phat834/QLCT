import { describe, it, expect } from 'vitest';
import { Wallet } from '../domain/entities/Wallet.js';
import { WalletType } from '../domain/enums/WalletType.js';

describe('Wallet', () => {
  it('should initialize with given balance', () => {
    const wallet = new Wallet('w1', 'Wallet', 1000);
    expect(wallet.getBalance()).toBe(1000);
    expect(wallet.getType()).toBe(WalletType.AVAILABLE);
  });

  it('should throw if initial balance is negative', () => {
    expect(() => new Wallet('w1', 'Wallet', -1)).toThrow('Số dư ban đầu không được âm');
  });

  it('should deposit and withdraw correctly', () => {
    const wallet = new Wallet('w1', 'Wallet', 1000);
    wallet.deposit(500);
    expect(wallet.getBalance()).toBe(1500);
    wallet.withdraw(200);
    expect(wallet.getBalance()).toBe(1300);
  });

  it('should throw on withdraw exceeding balance', () => {
    const wallet = new Wallet('w1', 'Wallet', 1000);
    expect(() => wallet.withdraw(1001)).toThrow('Số dư không đủ');
  });

  it('should default to AVAILABLE type when type not provided', () => {
    const wallet = new Wallet('w1', 'Wallet', 1000);
    expect(wallet.getType()).toBe(WalletType.AVAILABLE);
  });

  it('should support SAVINGS type', () => {
    const wallet = new Wallet('w1', 'Savings Wallet', 5000, undefined, WalletType.SAVINGS);
    expect(wallet.getType()).toBe(WalletType.SAVINGS);
  });
});
