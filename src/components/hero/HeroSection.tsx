import { motion } from "framer-motion";
import { TrendingUp, Zap, Activity } from "lucide-react";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className='hero-section-clean'>
      <div className='hero-gradient-bg' />

      <motion.div
        className='hero-content-container'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <div className='hero-left'>
          <motion.div className='hero-badge' variants={itemVariants}>
            <Zap size={14} />
            <span>Real-time Market Data</span>
          </motion.div>

          <motion.h1 className='hero-main-title' variants={itemVariants}>
            Crypto Intelligence Dashboard
          </motion.h1>

          <motion.p className='hero-description' variants={itemVariants}>
            Track prices, market movements, and trends across the globe. Build
            your watchlist and stay ahead of market changes with real-time
            updates powered by industry-leading data sources.
          </motion.p>

          <motion.div className='hero-stats' variants={itemVariants}>
            <div className='stat-item'>
              <Activity size={20} />
              <div>
                <div className='stat-label'>Live Prices</div>
                <div className='stat-value'>Updated 24/7</div>
              </div>
            </div>
            <div className='stat-item'>
              <TrendingUp size={20} />
              <div>
                <div className='stat-label'>Market Trends</div>
                <div className='stat-value'>Real-time Analysis</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div className='hero-right' variants={itemVariants}>
          <div className='hero-card'>
            <div className='card-header'>
              <div className='card-dot dot-1' />
              <div className='card-dot dot-2' />
              <div className='card-dot dot-3' />
            </div>
            <div className='card-content'>
              <div className='crypto-list'>
                <div className='crypto-item'>
                  <span className='crypto-icon'>₿</span>
                  <div>
                    <div className='crypto-name'>Bitcoin</div>
                    <div className='crypto-change positive'>+2.4%</div>
                  </div>
                </div>
                <div className='crypto-item'>
                  <span className='crypto-icon'>Ξ</span>
                  <div>
                    <div className='crypto-name'>Ethereum</div>
                    <div className='crypto-change positive'>+1.8%</div>
                  </div>
                </div>
                <div className='crypto-item'>
                  <span className='crypto-icon'>◆</span>
                  <div>
                    <div className='crypto-name'>Market Cap</div>
                    <div className='crypto-value'>$2.8T</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className='hero-scroll-indicator'
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className='scroll-dot' />
      </motion.div>
    </section>
  );
}
