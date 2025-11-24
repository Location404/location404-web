import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MatchResult from '../MatchResult.vue'
import type { GameRoundDto } from '@/types'

describe('MatchResult', () => {
  const createWrapper = (props: any) => {
    return mount(MatchResult, {
      props,
    })
  }

  const mockRounds: GameRoundDto[] = [
    {
      id: 'round-1',
      roundNumber: 1,
      playerAPoints: 5000,
      playerBPoints: 3000,
      playerAGuess: { x: 0, y: 0 },
      playerBGuess: { x: 0, y: 0 },
      correctLocation: { x: 0, y: 0 },
      playerADistanceKm: 0,
      playerBDistanceKm: 0,
      isCompleted: true,
    },
    {
      id: 'round-2',
      roundNumber: 2,
      playerAPoints: 2000,
      playerBPoints: 4000,
      playerAGuess: { x: 0, y: 0 },
      playerBGuess: { x: 0, y: 0 },
      correctLocation: { x: 0, y: 0 },
      playerADistanceKm: 0,
      playerBDistanceKm: 0,
      isCompleted: true,
    },
    {
      id: 'round-3',
      roundNumber: 3,
      playerAPoints: 3000,
      playerBPoints: 3000,
      playerAGuess: { x: 0, y: 0 },
      playerBGuess: { x: 0, y: 0 },
      correctLocation: { x: 0, y: 0 },
      playerADistanceKm: 0,
      playerBDistanceKm: 0,
      isCompleted: true,
    },
  ]

  describe('Winner Display', () => {
    it('should show victory message when player wins', () => {
      const wrapper = createWrapper({
        winnerId: 'player-1',
        loserId: 'player-2',
        playerATotalPoints: 10000,
        playerBTotalPoints: 8000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds: mockRounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('VITÓRIA!')
      expect(wrapper.text()).toContain('Parabéns! Você venceu a partida!')
    })

    it('should show defeat message when player loses', () => {
      const wrapper = createWrapper({
        winnerId: 'player-2',
        loserId: 'player-1',
        playerATotalPoints: 8000,
        playerBTotalPoints: 10000,
        pointsEarned: 0,
        pointsLost: 25,
        rounds: mockRounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('DERROTA')
      expect(wrapper.text()).toContain('Quase lá! Continue treinando!')
    })
  })

  describe('Points Display', () => {
    it('should show points earned when player wins', () => {
      const wrapper = createWrapper({
        winnerId: 'player-1',
        loserId: 'player-2',
        playerATotalPoints: 10000,
        playerBTotalPoints: 8000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds: mockRounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('+50')
    })

    it('should show points lost when player loses', () => {
      const wrapper = createWrapper({
        winnerId: 'player-2',
        loserId: 'player-1',
        playerATotalPoints: 8000,
        playerBTotalPoints: 10000,
        pointsEarned: 0,
        pointsLost: 25,
        rounds: mockRounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('-25')
    })

    it('should show correct total points for player A', () => {
      const wrapper = createWrapper({
        winnerId: 'player-1',
        loserId: 'player-2',
        playerATotalPoints: 10000,
        playerBTotalPoints: 8000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds: mockRounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('10000')
      expect(wrapper.text()).toContain('8000')
    })

    it('should show correct total points for player B', () => {
      const wrapper = createWrapper({
        winnerId: 'player-2',
        loserId: 'player-1',
        playerATotalPoints: 8000,
        playerBTotalPoints: 10000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds: mockRounds,
        isPlayerA: false,
        currentPlayerId: 'player-2',
      })

      expect(wrapper.text()).toContain('10000')
      expect(wrapper.text()).toContain('8000')
    })
  })

  describe('Round Display', () => {
    it('should display all rounds', () => {
      const wrapper = createWrapper({
        winnerId: 'player-1',
        loserId: 'player-2',
        playerATotalPoints: 10000,
        playerBTotalPoints: 8000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds: mockRounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('Rodada 1')
      expect(wrapper.text()).toContain('Rodada 2')
      expect(wrapper.text()).toContain('Rodada 3')
    })

    it('should show round winner correctly for player A', () => {
      const wrapper = createWrapper({
        winnerId: 'player-1',
        loserId: 'player-2',
        playerATotalPoints: 10000,
        playerBTotalPoints: 8000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds: mockRounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('Ganhou')
      expect(wrapper.text()).toContain('Perdeu')
      expect(wrapper.text()).toContain('Empate')
    })

    it('should show correct points for each round', () => {
      const wrapper = createWrapper({
        winnerId: 'player-1',
        loserId: 'player-2',
        playerATotalPoints: 10000,
        playerBTotalPoints: 8000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds: mockRounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('5000 pts')
      expect(wrapper.text()).toContain('3000 pts')
      expect(wrapper.text()).toContain('2000 pts')
      expect(wrapper.text()).toContain('4000 pts')
    })
  })

  describe('Play Again Action', () => {
    it('should emit playAgain event when button is clicked', async () => {
      const wrapper = createWrapper({
        winnerId: 'player-1',
        loserId: 'player-2',
        playerATotalPoints: 10000,
        playerBTotalPoints: 8000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds: mockRounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(wrapper.emitted('playAgain')).toBeTruthy()
      expect(wrapper.emitted('playAgain')?.length).toBe(1)
    })

    it('should display play again button text', () => {
      const wrapper = createWrapper({
        winnerId: 'player-1',
        loserId: 'player-2',
        playerATotalPoints: 10000,
        playerBTotalPoints: 8000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds: mockRounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('Jogar Novamente')
    })
  })

  describe('Round Winner Logic', () => {
    it('should correctly identify tie rounds', () => {
      const rounds: GameRoundDto[] = [
        {
          id: 'round-1',
          roundNumber: 1,
          playerAPoints: 3000,
          playerBPoints: 3000,
          playerAGuess: { x: 0, y: 0 },
          playerBGuess: { x: 0, y: 0 },
          correctLocation: { x: 0, y: 0 },
          playerADistanceKm: 0,
          playerBDistanceKm: 0,
          isCompleted: true,
        },
      ]

      const wrapper = createWrapper({
        winnerId: 'player-1',
        loserId: 'player-2',
        playerATotalPoints: 3000,
        playerBTotalPoints: 3000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('Empate')
    })

    it('should handle null points in rounds', () => {
      const rounds: GameRoundDto[] = [
        {
          id: 'round-1',
          roundNumber: 1,
          playerAPoints: null,
          playerBPoints: null,
          playerAGuess: { x: 0, y: 0 },
          playerBGuess: { x: 0, y: 0 },
          correctLocation: { x: 0, y: 0 },
          playerADistanceKm: 0,
          playerBDistanceKm: 0,
          isCompleted: false,
        },
      ]

      const wrapper = createWrapper({
        winnerId: 'player-1',
        loserId: 'player-2',
        playerATotalPoints: 0,
        playerBTotalPoints: 0,
        pointsEarned: 0,
        pointsLost: 0,
        rounds,
        isPlayerA: true,
        currentPlayerId: 'player-1',
      })

      expect(wrapper.text()).toContain('Empate')
    })

    it('should display correct points for player B perspective', () => {
      const wrapper = createWrapper({
        winnerId: 'player-2',
        loserId: 'player-1',
        playerATotalPoints: 8000,
        playerBTotalPoints: 10000,
        pointsEarned: 50,
        pointsLost: 0,
        rounds: mockRounds,
        isPlayerA: false,
        currentPlayerId: 'player-2',
      })

      // Player B wins round 2
      expect(wrapper.text()).toContain('4000 pts')
      expect(wrapper.text()).toContain('2000 pts')
    })
  })
})
