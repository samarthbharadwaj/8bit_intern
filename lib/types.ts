export type Stock = {
  particulars: string;
  purchasePrice: number;
  qty: number;
  sector: string;
  exchange: string;
  cmp: number;
  peRatio: number;
  latestEarnings: number;
};

export const holdings: Stock[] = [
  {
    particulars: 'HDFC Bank',
    purchasePrice: 1490,
    qty: 50,
    sector: 'Financial Sector',
    exchange: 'HDFCBANK',
    cmp: 0,
    peRatio: 0,
    latestEarnings: 0,
  },
  {
    particulars: "Bajaj Finance",
    purchasePrice: 6466,
    qty: 15,
    sector: "Financial Sector",
    exchange: "BAJFINANCE",
    cmp: 1252.78,
    peRatio: 27.26,
    latestEarnings: "201273"
  },
  {
    particulars: "ICICI Bank",
    purchasePrice: 780,
    qty: 84,
    sector: "Financial Sector",
    exchange: "532174",
    cmp: 365.79,
    peRatio: 21.4,
    latestEarnings: "4332"
  },
  {
    particulars: "Affle India",
    purchasePrice: 1151,
    qty: 50,
    sector: "Tech Sector",
    exchange: "AFFLE",
    cmp: 183,
    peRatio: 52.78,
    latestEarnings: "902"
  },
  {
    particulars: "LTI Mindtree",
    purchasePrice: 4775,
    qty: 16,
    sector: "Tech Sector",
    exchange: "LTIM",
    cmp: 676,
    peRatio: 42.13,
    latestEarnings: "16058"
  },
  {
    particulars: "Tata Power",
    purchasePrice: 224,
    qty: 225,
    sector: "Power",
    exchange: "500400",
    cmp: 101,
    peRatio: 23.4,
    latestEarnings: "42175"
  },
  {
    particulars: "Dmart",
    purchasePrice: 3777,
    qty: 27,
    sector: "Consumer",
    exchange: "DMART",
    cmp: 288,
    peRatio: 28.13,
    latestEarnings: "9404"
  },
  {
    particulars: "Tata Consumer",
    purchasePrice: 845,
    qty: 90,
    sector: "Consumer",
    exchange: "532540",
    cmp: 249,
    peRatio: 13.63,
    latestEarnings: "197423"
  },
];