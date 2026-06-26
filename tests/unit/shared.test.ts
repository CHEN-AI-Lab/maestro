import { describe, it, expect } from 'vitest'

describe('Shared constants', () => {
  it('has API_BASE_URL constant', () => {
    const { API_BASE_URL } = require('@/shared/constants')
    expect(API_BASE_URL).toBeDefined()
  })
})

describe('Shared utils', () => {
  it('exports utility functions', () => {
    const utils = require('@/shared/utils')
    expect(utils).toBeDefined()
  })
})
