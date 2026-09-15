import React from "react";
import { holdings } from "./types";

export default function PortfolioTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Stock</th>
          {/* eslint-disable-next-line */}
          <th>Purchase Price</th>
          <th>Qty</th>
          <th>CMP</th>
        </tr>
      </thead>
      <tbody>
        {holdings.map((stock, i) => (
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
