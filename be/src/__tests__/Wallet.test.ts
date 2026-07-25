import { describe, it, expect } from 'vitest';
import { Wallet } from '../domain/entities/Wallet.js';

describe('Wallet', () => {
  it('should initialize with given balance', () => {
    const wallet = new Wallet('w1', 'Wallet', 1000);
    expect(wallet.getBalance()).toBe(1000);
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
});
