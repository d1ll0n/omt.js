import { Keccak } from 'sha3'

export const distance = (x: number, y: number): number => Math.abs(x-y) // Math.log(x^y)/Math.LOG2E
export const hashOf = (x: string | number): string => new Keccak(256).update(x).digest('hex')
export const min = (...args: number[]): number => Math.min(...args)
export const max = (...args: number[]): number => Math.max(...args)