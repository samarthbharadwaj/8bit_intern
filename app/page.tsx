'use client';

import { useEffect, useMemo, useState } from 'react';
import { holdings, Stock } from '../lib/types';

type IconName = 'grid' | 'briefcase' | 'chart' | 'settings' | 'search' | 'refresh' | 'bell' | 'download' | 'arrow';

type IconProps = { name: IconName; size?: number };

function Icon({ name, size = 18 }: IconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-7" /></>,
    settings: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.9 1.9-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.7v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.9-1.9.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.7h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.9-1.9.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V4h2.7v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.9 1.9-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2V13h-.2a1.7 1.7 0 0 0-1.6 1Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.9-4L3 10" /><path d="M3 5v5h5M4 13a8 8 0 0 0 14.9 4L21 14" /><path d="M21 19v-5h-5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 20h16" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  };

  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
}

function getInvestment(stock: Stock) {
  return stock.purchasePrice * stock.qty;
}

function getPresentValue(stock: Stock) {
  return stock.cmp * stock.qty;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All sectors');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => setLastUpdated(new Date()), 15000);
    return () => window.clearInterval(interval);
  }, []);

  const refresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 500);
  };

  const sectors = ['All sectors', ...Array.from(new Set(holdings.map((stock) => stock.sector)))];
  const filteredHoldings = holdings.filter((stock) => {
    const matchesQuery = `${stock.particulars} ${stock.exchange}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (sector === 'All sectors' || stock.sector === sector);
  });

  const totals = useMemo(() => holdings.reduce((summary, stock) => {
    const investment = getInvestment(stock);
    const presentValue = getPresentValue(stock);
    return {
      investment: summary.investment + investment,
      presentValue: summary.presentValue + presentValue,
      gainLoss: summary.gainLoss + presentValue - investment,
      quantity: summary.quantity + stock.qty,
    };
  }, { investment: 0, presentValue: 0, gainLoss: 0, quantity: 0 }), []);

  const sectorSummary = useMemo(() => {
    const grouped = holdings.reduce<Record<string, { investment: number; presentValue: number; gainLoss: number }>>((summary, stock) => {
      const investment = getInvestment(stock);
      const presentValue = getPresentValue(stock);
      const current = summary[stock.sector] ?? { investment: 0, presentValue: 0, gainLoss: 0 };
      summary[stock.sector] = { investment: current.investment + investment, presentValue: current.presentValue + presentValue, gainLoss: current.gainLoss + presentValue - investment };
      return summary;
    }, {});
    return Object.entries(grouped);
  }, []);

  const gainPercent = totals.investment ? (totals.gainLoss / totals.investment) * 100 : 0;
  const updatedTime = lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">P</span><span>portfolio<span className="brand-dot">.</span></span></div>
        <div className="workspace-label">Workspace</div>
        <nav className="nav-list" aria-label="Primary navigation">
          <a className="nav-item active" href="#overview"><Icon name="grid" />Overview</a>
          <a className="nav-item" href="#holdings"><Icon name="briefcase" />Holdings</a>
          <a className="nav-item" href="#sectors"><Icon name="chart" />Sectors</a>
        </nav>
        <div className="sidebar-bottom"><a className="nav-item" href="#settings"><Icon name="settings" />Settings</a><div className="profile"><span className="avatar">S</span><span><strong>samarth</strong><small>Personal account</small></span><span className="profile-menu">•••</span></div></div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="mobile-brand"><span className="brand-mark">P</span><strong>portfolio<span className="brand-dot">.</span></strong></div><div className="topbar-actions"><span className="secure-pill"><span className="status-dot" />Market data connected</span><button className="icon-button" aria-label="Notifications"><Icon name="bell" /></button><button className="avatar small-avatar" aria-label="Open profile">S</button></div></header>

        <div className="page-wrap" id="overview">
          <div className="page-heading"><div><p className="eyebrow">Tuesday, 24 September 2024</p><h1>Good morning, samarth.</h1><p className="heading-subtitle">Here&apos;s what&apos;s happening with your portfolio today.</p></div><button className={`refresh-button ${isRefreshing ? 'spinning' : ''}`} onClick={refresh}><Icon name="refresh" />Refresh data</button></div>

          <div className="metric-grid">
            <article className="metric-card featured"><div className="metric-top"><span className="metric-label">Total portfolio value</span><span className="metric-icon mint"><Icon name="chart" size={17} /></span></div><strong className="metric-value">{formatCurrency(totals.presentValue)}</strong><div className="metric-footer"><span className="trend down">↓ {Math.abs(gainPercent).toFixed(1)}%</span><span>since purchase</span></div></article>
            <article className="metric-card"><div className="metric-top"><span className="metric-label">Total investment</span><span className="metric-icon peach"><Icon name="briefcase" size={17} /></span></div><strong className="metric-value">{formatCurrency(totals.investment)}</strong><div className="metric-footer"><span>{holdings.length} holding</span><span>•</span><span>{formatNumber(totals.quantity)} shares</span></div></article>
            <article className="metric-card"><div className="metric-top"><span className="metric-label">Overall gain / loss</span><span className="metric-icon rose"><Icon name="arrow" size={17} /></span></div><strong className="metric-value negative">{formatCurrency(totals.gainLoss)}</strong><div className="metric-footer"><span className="negative">Unrealized loss</span><span>•</span><span>All time</span></div></article>
          </div>

          <section className="panel holdings-panel" id="holdings"><div className="panel-heading"><div><h2>Portfolio holdings</h2><p>Track performance across your investments</p></div><button className="export-button"><Icon name="download" size={16} />Export</button></div><div className="toolbar"><label className="search-box"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search holdings..." aria-label="Search holdings" /></label><select value={sector} onChange={(event) => setSector(event.target.value)} aria-label="Filter by sector">{sectors.map((option) => <option key={option}>{option}</option>)}</select><span className="update-label"><span className="status-dot" />Auto-refreshes every 15s <span className="divider" />Updated {updatedTime}</span></div><div className="table-wrap"><table><thead><tr><th>Particulars</th><th>Purchase price</th><th>Qty</th><th>Investment</th><th>Portfolio %</th><th>NSE / BSE</th><th>CMP</th><th>Present value</th><th>Gain / loss</th><th>P/E ratio</th><th>Latest earnings</th></tr></thead><tbody>{filteredHoldings.map((stock) => { const investment = getInvestment(stock); const presentValue = getPresentValue(stock); const gainLoss = presentValue - investment; const allocation = totals.investment ? (investment / totals.investment) * 100 : 0; return <tr key={stock.exchange}><td><div className="stock-name"><span className="stock-logo">H</span><span><strong>{stock.particulars}</strong><small>{stock.sector}</small></span></div></td><td>{formatCurrency(stock.purchasePrice)}</td><td>{stock.qty}</td><td>{formatCurrency(investment)}</td><td><span className="allocation"><span style={{ width: `${allocation}%` }} />{allocation.toFixed(0)}%</span></td><td><span className="ticker">{stock.exchange}</span></td><td>{formatCurrency(stock.cmp)}</td><td>{formatCurrency(presentValue)}</td><td className={gainLoss >= 0 ? 'positive' : 'negative'}><strong>{formatCurrency(gainLoss)}</strong><small>{investment ? `${((gainLoss / investment) * 100).toFixed(1)}%` : '—'}</small></td><td>{stock.peRatio || '—'}</td><td>{stock.latestEarnings ? formatCurrency(stock.latestEarnings) : '—'}</td></tr>})}</tbody></table>{filteredHoldings.length === 0 && <div className="empty-state">No holdings match your search.</div>}</div></section>

          <section className="panel sector-panel" id="sectors"><div className="panel-heading"><div><h2>Sector allocation</h2><p>See how your portfolio is distributed</p></div><a className="view-link" href="#holdings">View holdings <Icon name="arrow" size={15} /></a></div><div className="sector-list">{sectorSummary.map(([name, summary]) => { const weight = totals.investment ? (summary.investment / totals.investment) * 100 : 0; return <div className="sector-row" key={name}><div className="sector-info"><span className="sector-swatch" /><strong>{name}</strong><span className="sector-weight">{weight.toFixed(0)}%</span></div><div className="sector-bar"><span style={{ width: `${weight}%` }} /></div><div className="sector-numbers"><span><small>Invested</small>{formatCurrency(summary.investment)}</span><span><small>Present value</small>{formatCurrency(summary.presentValue)}</span><span className={summary.gainLoss >= 0 ? 'positive' : 'negative'}><small>Gain / loss</small>{formatCurrency(summary.gainLoss)}</span></div></div>})}</div></section>
          <footer className="footer"><span>Portfolio Pulse <span className="footer-dot">•</span> Data is for illustrative purposes only.</span><span>Last synced {updatedTime}</span></footer>
        </div>
      </section>
    </main>
  );
}
