import { portfolioData } from "./dataset";

export default function PortfolioTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Stock</th>
          <th>Purchase Price</th>
          <th>Qty</th>
          <th>CMP</th>
        </tr>
      </thead>
      <tbody>
        {portfolioData.map((stock, i) => (
          <tr key={i}>
            <td>{stock.particulars}</td>
            <td>{stock.purchasePrice}</td>
            <td>{stock.qty}</td>
            <td>{stock.cmp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
