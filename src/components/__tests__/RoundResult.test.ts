import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RoundResult from '../RoundResult.vue'
import type { Coordinate } from '@/types'

// Mock RoundResultMap component
vi.mock('../RoundResultMap.vue', () => ({
  default: {
    name: 'RoundResultMap',
    template: '<div>Mock Map</div>',
  },
}))

describe('RoundResult', () => {
  const mockCorrectAnswer: Coordinate = { x: 0, y: 0 }
  const mockPlayerAGuess: Coordinate = { x: 1, y: 1 }
  const mockPlayerBGuess: Coordinate = { x: 2, y: 2 }

  const createWrapper = (props: any) => {
    return mount(RoundResult, {
      props: {
        apiKey: 'test-api-key',
        roundNumber: 1,
        correctAnswer: mockCorrectAnswer,
        playerAGuess: mockPlayerAGuess,
        playerBGuess: mockPlayerBGuess,
        playerAPoints: 5000,
        playerBPoints: 3000,
        playerATotalPoints: 5000,
        playerBTotalPoints: 3000,
        isPlayerA: true,
        canStartNewRound: true,
        ...props,
      },
    })
  }

  describe('Round Number Display', () => {
    it('should display correct round number', () => {
      const wrapper = createWrapper({ roundNumber: 2 })
      expect(wrapper.text()).toContain('Resultado da Rodada 2')
    })

    it('should display round 1', () => {
      const wrapper = createWrapper({ roundNumber: 1 })
      expect(wrapper.text()).toContain('Resultado da Rodada 1')
    })

    it('should display round 3', () => {
      const wrapper = createWrapper({ roundNumber: 3 })
      expect(wrapper.text()).toContain('Resultado da Rodada 3')
    })
  })

  describe('Player Points Display', () => {
    it('should show correct points for player A perspective', () => {
      const wrapper = createWrapper({
        playerAPoints: 5000,
        playerBPoints: 3000,
        isPlayerA: true,
      })

      expect(wrapper.text()).toContain('5000 pts')
      expect(wrapper.text()).toContain('3000 pts')
    })

    it('should show correct points for player B perspective', () => {
      const wrapper = createWrapper({
        playerAPoints: 5000,
        playerBPoints: 3000,
        isPlayerA: false,
      })

      expect(wrapper.text()).toContain('3000 pts')
      expect(wrapper.text()).toContain('5000 pts')
    })

    it('should display total points correctly', () => {
      const wrapper = createWrapper({
        playerATotalPoints: 10000,
        playerBTotalPoints: 8000,
        isPlayerA: true,
      })

      expect(wrapper.text()).toContain('10000')
      expect(wrapper.text()).toContain('8000')
    })
  })

  describe('Distance Calculation', () => {
    it('should calculate distance using Haversine formula', () => {
      const wrapper = createWrapper({
        correctAnswer: { x: 0, y: 0 },
        playerAGuess: { x: 0, y: 0 },
        isPlayerA: true,
      })

      expect(wrapper.text()).toContain('0.00 km')
    })

    it('should show distance for both players', () => {
      const wrapper = createWrapper({
        correctAnswer: { x: 0, y: 0 },
        playerAGuess: { x: 1, y: 1 },
        playerBGuess: { x: 2, y: 2 },
        isPlayerA: true,
      })

      const text = wrapper.text()
      expect(text).toContain('km')
    })

    it('should handle far distances', () => {
      const wrapper = createWrapper({
        correctAnswer: { x: 0, y: 0 },
        playerAGuess: { x: 45, y: 45 },
        isPlayerA: true,
      })

      expect(wrapper.text()).toMatch(/\d+\.\d+ km/)
    })
  })

  describe('Null Guess Handling', () => {
    it('should show timeout message when player guess is null', () => {
      const wrapper = createWrapper({
        playerAGuess: null,
        isPlayerA: true,
      })

      expect(wrapper.text()).toContain('Tempo esgotado! Sem palpite.')
    })

    it('should show timeout message when opponent guess is null', () => {
      const wrapper = createWrapper({
        playerBGuess: null,
        isPlayerA: true,
      })

      expect(wrapper.text()).toContain('Tempo esgotado! Sem palpite.')
    })

    it('should show timeout for both players when both are null', () => {
      const wrapper = createWrapper({
        playerAGuess: null,
        playerBGuess: null,
        isPlayerA: true,
      })

      const timeoutMessages = wrapper.text().match(/Tempo esgotado! Sem palpite\./g)
      expect(timeoutMessages).toHaveLength(2)
    })

    it('should show timeout message instead of distance when guess is null', () => {
      const wrapper = createWrapper({
        playerAGuess: null,
        isPlayerA: true,
      })

      // Should show timeout message for player
      expect(wrapper.text()).toContain('Tempo esgotado! Sem palpite.')
      // But opponent still has distance shown
      expect(wrapper.text()).toContain('Distância:')
    })
  })

  describe('Coordinates Display', () => {
    it('should display player guess coordinates', () => {
      const wrapper = createWrapper({
        playerAGuess: { x: 45.5, y: -73.5 },
        isPlayerA: true,
      })

      expect(wrapper.text()).toContain('45.50°, -73.50°')
    })

    it('should display opponent guess coordinates', () => {
      const wrapper = createWrapper({
        playerBGuess: { x: 30.2, y: 50.7 },
        isPlayerA: true,
      })

      expect(wrapper.text()).toContain('30.20°, 50.70°')
    })

    it('should display correct answer coordinates', () => {
      const wrapper = createWrapper({
        correctAnswer: { x: 51.5, y: -0.1 },
      })

      expect(wrapper.text()).toContain('51.50°, -0.10°')
    })
  })

  describe('Button Text', () => {
    it('should show "Próxima Rodada" when canStartNewRound is true', () => {
      const wrapper = createWrapper({
        canStartNewRound: true,
      })

      expect(wrapper.text()).toContain('Próxima Rodada')
    })

    it('should show "Ver Resultado Final" when canStartNewRound is false', () => {
      const wrapper = createWrapper({
        canStartNewRound: false,
      })

      expect(wrapper.text()).toContain('Ver Resultado Final')
    })
  })

  describe('Continue Action', () => {
    it('should emit continue event when button is clicked', async () => {
      const wrapper = createWrapper({})

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(wrapper.emitted('continue')).toBeTruthy()
      expect(wrapper.emitted('continue')?.length).toBe(1)
    })

    it('should emit continue for last round', async () => {
      const wrapper = createWrapper({
        canStartNewRound: false,
      })

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(wrapper.emitted('continue')).toBeTruthy()
    })
  })

  describe('Score Comparison', () => {
    it('should highlight winner in green for player', () => {
      const wrapper = createWrapper({
        playerAPoints: 5000,
        playerBPoints: 3000,
        isPlayerA: true,
      })

      expect(wrapper.html()).toContain('border-green-500')
    })

    it('should highlight loser in red for player', () => {
      const wrapper = createWrapper({
        playerAPoints: 3000,
        playerBPoints: 5000,
        isPlayerA: true,
      })

      expect(wrapper.html()).toContain('border-red-500')
    })

    it('should highlight tie in yellow', () => {
      const wrapper = createWrapper({
        playerAPoints: 4000,
        playerBPoints: 4000,
        isPlayerA: true,
      })

      expect(wrapper.html()).toContain('border-yellow-500')
    })
  })

  describe('Map Component', () => {
    it('should render RoundResultMap component', () => {
      const wrapper = createWrapper({})
      expect(wrapper.text()).toContain('Mock Map')
    })
  })

  describe('Player Perspective Switching', () => {
    it('should show correct data from player B perspective', () => {
      const wrapper = createWrapper({
        playerAPoints: 5000,
        playerBPoints: 3000,
        playerATotalPoints: 10000,
        playerBTotalPoints: 8000,
        isPlayerA: false,
      })

      // Player B should see their own points (3000) as "Você"
      const text = wrapper.text()
      expect(text).toContain('3000 pts')
      expect(text).toContain('5000 pts')
      expect(text).toContain('8000')
      expect(text).toContain('10000')
    })
  })
})
