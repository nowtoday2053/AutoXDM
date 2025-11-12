import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import type { HTMLMotionProps, Variants } from 'framer-motion'
import confetti from 'canvas-confetti'
import clsx from 'clsx'
import logo from './assets/autoxdm-logo.svg'

const features = [
  {
    id: 1,
    title: 'Local Automation',
    description: 'Run unlimited DM campaigns right from your desktop. No servers, no API limits, etc. Run it 24/7.',
    icon: '⚡',
  },
  {
    id: 2,
    title: 'Smart Personalization',
    description: 'Send personalized messages, not bot messages. Each DM is personalized for every account you outreach to.',
    icon: '💬',
  },
  {
    id: 3,
    title: 'Lifetime Control',
    description: 'Own the tool forever. Once you buy it once, you have access to it forever and are able to run unlimited campaigns, add unlimited accounts, etc.',
    icon: '📊',
  },
]

const testimonials = [
  {
    quote:
      'Within weeks, our outbound pipeline doubled. The automation feels human, and the tool runs 24/7 without the need of manual oversight.',
    name: 'Avery Chen',
    role: 'Head of Growth, LumenAI',
    avatar: 'https://i.pravatar.cc/120?img=5',
    rating: 5,
  },
  {
    quote:
      'We replaced a patchwork of tools with one cohesive system. Our team can finally focus on conversations, not logistics.',
    name: 'Jordan Reyes',
    role: 'Founder, Signal Labs',
    avatar: 'https://i.pravatar.cc/120?img=22',
    rating: 5,
  },
  {
    quote:
      'The personalization engine is unreal. Prospects regularly mention how the DM felt like it was written just for them.',
    name: 'Michael Brooks',
    role: 'Growth Marketer, Northbound',
    avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=facearea&facepad=3&w=120&h=120&q=80&crop=faces',
    rating: 4.5,
  },
  {
    quote:
      'Our SDRs now orchestrate sophisticated campaigns in minutes. The boost in response quality pays for the platform.',
    name: 'Kai Nakamura',
    role: 'Revenue Operations, FluxWave',
    avatar: 'https://i.pravatar.cc/120?img=31',
    rating: 5,
  },
]

const lifetimePlan = {
  name: 'Lifetime Access',
  description: 'One Time Payment',
  price: 100,
  highlights: ['Add Unlimited Accounts', 'Send Unlimited Messages', 'Create Unlimited campaigns', 'Priority support channel'],
}

const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

const fadeStagger = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  }),
} satisfies Variants

type MagneticButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'ghost'
  children?: ReactNode
}

const MagneticButton = ({ children, variant = 'primary', className, ...props }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const handleMouseMove = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)
    x.set(offsetX * 0.3)
    y.set(offsetY * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x: event.clientX - rect.left, y: event.clientY - rect.top }])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
    }, 800)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(event) => {
        handleClick(event)
        props.onClick?.(event)
      }}
      className={clsx('magnetic-button', `magnetic-button--${variant}`, className)}
      {...props}
    >
      {children}
      <span className="button-glow" />
      <span className="button-border" />
      {ripples.map((ripple) => (
        <span key={ripple.id} className="button-ripple" style={{ left: ripple.x, top: ripple.y }} />
      ))}
    </motion.button>
  )
}

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating)
  const partialStar = rating - fullStars
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, index) => {
        const fill = index < fullStars ? 1 : index === fullStars ? partialStar : 0
        return (
          <div className="star" key={index}>
            <svg viewBox="0 0 24 24">
              <path className="star-outline" d="M12 3.04 14.95 8.5l6.05.88-4.38 4.27 1.03 6.02L12 16.99l-5.65 2.98 1.03-6.02L3 9.38l6.05-.88L12 3.04z" />
              <motion.g className="star-fill" animate={{ scaleX: fill }} transition={{ duration: 0.6, ease: 'easeOut' }}>
                <path d="M12 3.04 14.95 8.5l6.05.88-4.38 4.27 1.03 6.02L12 16.99l-5.65 2.98 1.03-6.02L3 9.38l6.05-.88L12 3.04z" />
              </motion.g>
            </svg>
          </div>
        )
      })}
    </div>
  )
}

const useKonamiConfetti = () => {
  const buffer = useRef<string[]>([])

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      buffer.current.push(event.key)
      if (buffer.current.length > konamiSequence.length) {
        buffer.current.shift()
      }
      if (konamiSequence.every((key, index) => buffer.current[index]?.toLowerCase() === key.toLowerCase())) {
        confetti({
          particleCount: 180,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#1DA1F2', '#7856FF', '#ffffff'],
        })
        buffer.current = []
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])
}

const CursorFollower = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const cursor = useMotionValue(-200)
  const cursorY = useMotionValue(-200)
  const springX = useSpring(cursor, { stiffness: 120, damping: 20 })
  const springY = useSpring(cursorY, { stiffness: 120, damping: 20 })

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      cursor.set(event.clientX)
      cursorY.set(event.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [cursor, cursorY])

  return <motion.div ref={ref} className="cursor-follower" style={{ translateX: springX, translateY: springY }} />
}

const SectionHeader = ({ eyebrow, title, description }: { eyebrow: string; title: string; description: ReactNode }) => (
  <motion.header className="section-header" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-20% 0px' }} variants={{ hidden: {}, show: {} }}>
    <motion.span className="section-eyebrow" variants={fadeStagger} custom={0}>
      {eyebrow}
    </motion.span>
    <motion.h2 className="section-title" variants={fadeStagger} custom={1}>
      {title}
    </motion.h2>
    <motion.p className="section-description" variants={fadeStagger} custom={2}>
      {description}
    </motion.p>
  </motion.header>
)

const HeroMockup = ({ isLoaded }: { isLoaded: boolean }) => {
  const [activeTab, setActiveTab] = useState<'Inbox' | 'Campaigns' | 'Insights'>('Insights')
  const tabs: Array<typeof activeTab> = ['Inbox', 'Campaigns', 'Insights']

  const summaryCards = [
    { label: 'DMs Sent', value: '12,480', trend: '+182%' },
    { label: 'Replies', value: '3,215', trend: '+96%' },
    { label: 'Revenue', value: '$384K', trend: '+128%' },
  ]

  const chartBars = [42, 68, 55, 74, 61, 92, 85]

  const roiRows = [
    { campaign: 'AI Launch Flow', revenue: '$128K', replies: '624', growth: '+148%' },
    { campaign: 'Warm Founder List', revenue: '$94K', replies: '412', growth: '+92%' },
    { campaign: 'Personal Loom Follow-Up', revenue: '$72K', replies: '318', growth: '+66%' },
  ]

  return (
    <motion.div className="hero-mockup" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.38, 0.84, 0.42, 1] }}>
      <div className="hero-mockup__glass">
        <div className="hero-mockup__header">
          <div className="status-dot" />
          <span>X Revenue Command Center</span>
          <div className="mockup-menu">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="hero-mockup__tabs">
          {tabs.map((tab) => (
            <button key={tab} className={clsx('hero-mockup__tab', { active: tab === activeTab })} onClick={() => setActiveTab(tab)} type="button">
              {tab}
            </button>
          ))}
        </div>
        <div className="hero-mockup__body">
          {!isLoaded && (
            <div className="mockup-skeleton">
              <span style={{ width: '64%' }} />
              <span style={{ width: '48%' }} />
              <span style={{ width: '86%' }} />
              <span style={{ width: '42%' }} />
            </div>
          )}
          <div className={clsx('mockup-analytics', { 'mockup-analytics--blurred': !isLoaded })}>
            <div className="analytics-summary">
              {summaryCards.map((card) => (
                <div key={card.label} className="summary-card">
                  <span className="summary-label">{card.label}</span>
                  <strong>{card.value}</strong>
                  <span className="summary-trend summary-trend--up">{card.trend}</span>
                </div>
              ))}
            </div>
            <div className="analytics-grid">
              <div className="analytics-panel analytics-panel--wide">
                <div className="panel-header">
                  <div>
                    <h4>Revenue from X DMs</h4>
                    <span>Last 30 days</span>
                  </div>
                  <div className="panel-value">$384,200</div>
                </div>
                <div className="panel-chart">
                  <div className="chart-bars">
                    {chartBars.map((height, index) => (
                      <span key={height + index} className={clsx('chart-bar', { 'chart-bar--accent': index === chartBars.length - 1 })} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="chart-legend">
                    <div>
                      <span className="legend-dot legend-dot--blue" />
                      <span>Revenue per day</span>
                    </div>
                    <span className="legend-value">Avg $12.8K</span>
                  </div>
                </div>
                <div className="analytics-table">
                  <div className="table-row table-row--header">
                    <span>Top Campaign</span>
                    <span>Revenue</span>
                    <span>Replies</span>
                    <span>Growth</span>
                  </div>
                  {roiRows.map((row) => (
                    <div key={row.campaign} className="table-row">
                      <span>{row.campaign}</span>
                      <span>{row.revenue}</span>
                      <span>{row.replies}</span>
                      <span className="growth growth--up">{row.growth}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const PricingCard = ({ plan, delay }: { plan: typeof lifetimePlan; delay: number }) => {
  return (
    <motion.article className="pricing-card pricing-card--lifetime" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-20% 0px' }} transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      <div className="pricing-headline">
        <h3>{plan.name}</h3>
      </div>
      <div className="pricing-price">
        <span className="pricing-amount">${plan.price}</span>
        <span className="pricing-suffix">One-time payment</span>
      </div>
      <ul className="pricing-list">
        {plan.highlights.map((highlight, index) => (
          <motion.li key={highlight} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + index * 0.1, duration: 0.4, ease: 'easeOut' }}>
            <span className="check-icon">✔</span>
            {highlight}
          </motion.li>
        ))}
      </ul>
      <MagneticButton type="button" className="pricing-cta">
        Buy Now
      </MagneticButton>
    </motion.article>
  )
}

const Carousel = () => {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  return (
    <div className="carousel" ref={carouselRef}>
      {testimonials.map((testimonial, index) => (
        <motion.article key={testimonial.name} className="testimonial-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: index * 0.1, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}>
          <div className="testimonial-header">
            <img src={testimonial.avatar} alt={`${testimonial.name} avatar`} loading="lazy" />
            <div>
              <h3>{testimonial.name}</h3>
              <span>{testimonial.role}</span>
            </div>
          </div>
          <p>“{testimonial.quote}”</p>
          <StarRating rating={testimonial.rating} />
        </motion.article>
      ))}
    </div>
  )
}

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useKonamiConfetti()

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="page-wrapper">
      <CursorFollower />
      <header className="hero" id="hero">
        <div className="hero-bg" />
        <nav className="nav">
          <div className="nav-brand">
            <img src={logo} alt="AutoXDM logo" />
            <span>AutoXDM</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="https://t.me/Cylobuilds" target="_blank" rel="noopener noreferrer">
              Contact
            </a>
          </div>
          <div className="nav-actions">
            <MagneticButton type="button">Buy Now</MagneticButton>
          </div>
        </nav>
        <div className="hero-content">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <span className="hero-eyebrow">Chrome Extension • X Automation</span>
            <h1>Send Unlimited X DMs With This Extension</h1>
            <p>You install it once, it's yours for life — send Unlimited X DMs directly from your computer with full control, privacy, and no recurring payments.</p>
            <div className="hero-cta">
              <MagneticButton type="button">Buy Now</MagneticButton>
            </div>
          </motion.div>
          <HeroMockup isLoaded={isLoaded} />
        </div>
      </header>

      <main>
        <section className="features" id="features">
          <SectionHeader eyebrow="Why AutoXDM" title="Everything you need to run premium outreach" description="Automate with empathy, personalize at scale, and understand how every campaign converts in real time." />
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.article key={feature.id} className="feature-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-20% 0px' }} transition={{ delay: index * 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <motion.div className="feature-icon" whileInView={{ rotate: [0, -6, 6, 0] }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 1.6, repeat: Infinity, repeatType: 'reverse' }}>
                  {feature.icon}
                </motion.div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="feature-glow" />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="social-proof" aria-labelledby="social-proof">
          <SectionHeader
            eyebrow="Loved by Operators"
            title="What Our Customers Say"
            description={
              <>
                We obsess over making automation feel personal.
                <br />
                The result? Better replies, faster revenue cycles, and delighted prospects.
              </>
            }
          />
          <Carousel />
        </section>

        <section className="pricing" id="pricing">
        <SectionHeader eyebrow="Simple Pricing" title="Own the AutoXDM Extension" description="One secure payment unlocks lifetime access, updates, and premium support. No subscriptions, no surprises." />
          <div className="pricing-grid">
            <PricingCard plan={lifetimePlan} delay={0} />
          </div>
        </section>

      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} AutoXDM. Built for modern outreach teams.</span>
        <div className="footer-links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#security">Security</a>
        </div>
      </footer>
    </div>
  )
}

export default App

