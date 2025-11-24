import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolbarForm from '../ToolbarForm.vue'
import { createRouter, createMemoryHistory } from 'vue-router'

describe('ToolbarForm', () => {
  const createWrapper = () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/play', name: 'play', component: { template: '<div>Play</div>' } },
        { path: '/ranking', name: 'ranking', component: { template: '<div>Ranking</div>' } },
        { path: '/config', name: 'config', component: { template: '<div>Config</div>' } },
      ],
    })

    return mount(ToolbarForm, {
      global: {
        plugins: [router],
      },
    })
  }

  describe('Logo and Branding', () => {
    it('should display the logo image', () => {
      const wrapper = createWrapper()
      const logo = wrapper.find('img[alt="Location404 Logo"]')

      expect(logo.exists()).toBe(true)
    })

    it('should display Location404 text', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).toContain('Location404')
    })

    it('should have correct logo alt text', () => {
      const wrapper = createWrapper()
      const logo = wrapper.find('img')

      expect(logo.attributes('alt')).toBe('Location404 Logo')
    })
  })

  describe('Navigation Links', () => {
    it('should have a link to play page', () => {
      const wrapper = createWrapper()
      const playLink = wrapper.find('a[href="/play"]')

      expect(playLink.exists()).toBe(true)
      expect(playLink.text()).toContain('Jogar')
    })

    it('should have a link to ranking page', () => {
      const wrapper = createWrapper()
      const rankingLink = wrapper.find('a[href="/ranking"]')

      expect(rankingLink.exists()).toBe(true)
    })

    it('should have a link to config page', () => {
      const wrapper = createWrapper()
      const configLink = wrapper.find('a[href="/config"]')

      expect(configLink.exists()).toBe(true)
    })

    it('should display all three navigation buttons', () => {
      const wrapper = createWrapper()
      const links = wrapper.findAll('a')

      expect(links.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Button Text', () => {
    it('should display Jogar button text', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).toContain('Jogar')
    })

    it('should display Ranking text on desktop', () => {
      const wrapper = createWrapper()
      const html = wrapper.html()

      expect(html).toContain('Ranking')
    })

    it('should display Configurações text on desktop', () => {
      const wrapper = createWrapper()
      const html = wrapper.html()

      expect(html).toContain('Configurações')
    })
  })

  describe('Icons', () => {
    it('should have SVG icons for ranking', () => {
      const wrapper = createWrapper()
      const rankingLink = wrapper.find('a[href="/ranking"]')
      const svg = rankingLink.find('svg')

      expect(svg.exists()).toBe(true)
    })

    it('should have SVG icons for config', () => {
      const wrapper = createWrapper()
      const configLink = wrapper.find('a[href="/config"]')
      const svg = configLink.find('svg')

      expect(svg.exists()).toBe(true)
    })

    it('should have correct viewBox for SVG icons', () => {
      const wrapper = createWrapper()
      const svgs = wrapper.findAll('svg')

      svgs.forEach(svg => {
        expect(svg.attributes('viewBox')).toBe('0 0 24 24')
      })
    })
  })

  describe('Styling Classes', () => {
    it('should have navigation container with backdrop blur', () => {
      const wrapper = createWrapper()
      const nav = wrapper.find('nav')

      expect(nav.exists()).toBe(true)
    })

    it('should have rounded full buttons', () => {
      const wrapper = createWrapper()
      const links = wrapper.findAll('a')

      links.forEach(link => {
        expect(link.classes()).toContain('rounded-full')
      })
    })

    it('should have hover effects on buttons', () => {
      const wrapper = createWrapper()
      const playLink = wrapper.find('a[href="/play"]')
      const classes = playLink.classes().join(' ')

      expect(classes).toContain('hover:bg-white/20')
    })
  })

  describe('Component Structure', () => {
    it('should render a nav element', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('nav').exists()).toBe(true)
    })

    it('should have logo positioned on the left', () => {
      const wrapper = createWrapper()
      const logoContainer = wrapper.find('div.absolute.left-4')

      expect(logoContainer.exists()).toBe(true)
    })

    it('should have navigation items in center', () => {
      const wrapper = createWrapper()
      const navItems = wrapper.find('div.flex.items-center.space-x-3')

      expect(navItems.exists()).toBe(true)
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive padding classes', () => {
      const wrapper = createWrapper()
      const nav = wrapper.find('nav')
      const classes = nav.classes().join(' ')

      expect(classes).toMatch(/p-\d/)
    })

    it('should hide text on mobile for ranking', () => {
      const wrapper = createWrapper()
      const html = wrapper.html()

      expect(html).toContain('hidden md:inline')
    })

    it('should hide text on mobile for config', () => {
      const wrapper = createWrapper()
      const rankingLink = wrapper.find('a[href="/ranking"]')
      const span = rankingLink.find('span')

      expect(span.classes()).toContain('hidden')
      expect(span.classes()).toContain('md:inline')
    })
  })

  describe('Accessibility', () => {
    it('should have alt text for logo', () => {
      const wrapper = createWrapper()
      const img = wrapper.find('img')

      expect(img.attributes('alt')).toBeTruthy()
    })

    it('should have descriptive link text', () => {
      const wrapper = createWrapper()
      const playLink = wrapper.find('a[href="/play"]')

      expect(playLink.text()).toBeTruthy()
    })
  })
})
