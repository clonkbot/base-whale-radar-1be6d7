import { useState, useEffect } from 'react';
import './styles.css';

interface WhaleAlert {
  id: string;
  token: string;
  ticker: string;
  buyAmount: number;
  priceChange: number;
  timestamp: Date;
  walletAddress: string;
  txHash: string;
  marketCap: number;
}

// Generate mock whale alerts
const generateMockAlert = (): WhaleAlert => {
  const tokens = [
    { name: 'BRETT', ticker: '$BRETT' },
    { name: 'DEGEN', ticker: '$DEGEN' },
    { name: 'TOSHI', ticker: '$TOSHI' },
    { name: 'AERO', ticker: '$AERO' },
    { name: 'MOCHI', ticker: '$MOCHI' },
    { name: 'BALD', ticker: '$BALD' },
    { name: 'NORMIE', ticker: '$NORMIE' },
    { name: 'BASED', ticker: '$BASED' },
  ];
  const token = tokens[Math.floor(Math.random() * tokens.length)];
  const buyAmount = Math.floor(Math.random() * 4500) + 500;
  const priceChange = Math.floor(Math.random() * 85) + 15;

  return {
    id: Math.random().toString(36).substr(2, 9),
    token: token.name,
    ticker: token.ticker,
    buyAmount,
    priceChange,
    timestamp: new Date(),
    walletAddress: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
    txHash: `0x${Math.random().toString(16).substr(2, 16)}`,
    marketCap: Math.floor(Math.random() * 50000000) + 100000,
  };
};

const formatCurrency = (num: number): string => {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toFixed(0)}`;
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

function ScanLine() {
  return <div className="scan-line" />;
}

function AlertCard({ alert, index }: { alert: WhaleAlert; index: number }) {
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`alert-card ${isNew ? 'alert-new' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="alert-header">
        <div className="token-info">
          <span className="token-ticker">{alert.ticker}</span>
          <span className="token-name">{alert.token}</span>
        </div>
        <div className="price-change">
          <span className="arrow">&#9650;</span>
          <span className="percentage">+{alert.priceChange}%</span>
        </div>
      </div>

      <div className="alert-body">
        <div className="data-row">
          <span className="label">BUY</span>
          <span className="value buy-amount">${alert.buyAmount.toLocaleString()}</span>
        </div>
        <div className="data-row">
          <span className="label">MCAP</span>
          <span className="value">{formatCurrency(alert.marketCap)}</span>
        </div>
        <div className="data-row">
          <span className="label">TIME</span>
          <span className="value time">{formatTime(alert.timestamp)}</span>
        </div>
      </div>

      <div className="alert-footer">
        <span className="wallet">{alert.walletAddress}</span>
        <a
          href={`https://basescan.org/tx/${alert.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="tx-link"
        >
          VIEW TX
        </a>
      </div>

      <div className="signal-bar" style={{ width: `${Math.min(alert.priceChange, 100)}%` }} />
    </div>
  );
}

function Stats({ alerts }: { alerts: WhaleAlert[] }) {
  const totalVolume = alerts.reduce((sum, a) => sum + a.buyAmount, 0);
  const avgChange = alerts.length > 0
    ? alerts.reduce((sum, a) => sum + a.priceChange, 0) / alerts.length
    : 0;
  const hotToken = alerts.length > 0
    ? alerts.reduce((acc, curr) =>
        curr.priceChange > acc.priceChange ? curr : acc
      ).ticker
    : '---';

  return (
    <div className="stats-panel">
      <div className="stat">
        <span className="stat-label">TOTAL VOLUME</span>
        <span className="stat-value">{formatCurrency(totalVolume)}</span>
      </div>
      <div className="stat">
        <span className="stat-label">AVG PUMP</span>
        <span className="stat-value green">+{avgChange.toFixed(1)}%</span>
      </div>
      <div className="stat">
        <span className="stat-label">HOT TOKEN</span>
        <span className="stat-value cyan">{hotToken}</span>
      </div>
      <div className="stat">
        <span className="stat-label">SIGNALS</span>
        <span className="stat-value">{alerts.length}</span>
      </div>
    </div>
  );
}

function App() {
  const [alerts, setAlerts] = useState<WhaleAlert[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Initial alerts
    const initialAlerts = Array.from({ length: 5 }, generateMockAlert);
    setAlerts(initialAlerts);

    // Simulate incoming alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        setAlerts(prev => {
          const newAlert = generateMockAlert();
          return [newAlert, ...prev].slice(0, 50);
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <ScanLine />

      <div className="grid-overlay" />

      <header className="header">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">&#9670;</span>
            <span className="logo-text">BASE WHALE RADAR</span>
          </div>
          <div className="chain-badge">
            <span className="chain-dot" />
            BASE CHAIN
          </div>
        </div>

        <div className="filters">
          <div className="filter-item active">
            <span className="filter-label">MIN BUY</span>
            <span className="filter-value">$500</span>
          </div>
          <div className="filter-item active">
            <span className="filter-label">MIN PUMP</span>
            <span className="filter-value">+15%</span>
          </div>
          <div className="filter-item">
            <span className="filter-label">TIMEFRAME</span>
            <span className="filter-value">5 MIN</span>
          </div>
        </div>

        <div className="status">
          <button
            className={`scan-btn ${isScanning ? 'scanning' : ''}`}
            onClick={() => setIsScanning(!isScanning)}
          >
            <span className="pulse-dot" />
            {isScanning ? 'SCANNING' : 'PAUSED'}
          </button>
        </div>
      </header>

      <Stats alerts={alerts} />

      <main className="main">
        <div className="section-header">
          <h2>LIVE SIGNALS</h2>
          <span className="signal-count">{alerts.length} DETECTED</span>
        </div>

        <div className="alerts-grid">
          {alerts.map((alert, index) => (
            <AlertCard key={alert.id} alert={alert} index={index} />
          ))}
        </div>
      </main>

      <footer className="footer">
        <span>Requested by @0xshina · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;
