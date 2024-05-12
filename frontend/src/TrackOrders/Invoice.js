import React from 'react';
import "./invoice.css";
const getOrderDetails = () => {
  return [
    { id: 1, partNo: 'IN205889', description: 'STAGE BUSH A88.5/98X22', uom: 'PC', qty: 15, rate: 4976, total: 74640 },
    { id: 2, partNo: 'IN206418', description: 'SPACER SLEEVE 75/90DIAX52.5', uom: 'PC', qty: 1, rate: 4512, total: 4512 },
    { id: 3, partNo: 'IN200012', description: 'CASING WEAR RING A159.5/170X20', uom: 'PC', qty: 16, rate: 4257, total: 68112 },
    // ... and so on
  ];
};

const Invoice = () => {
  const orderDetails = getOrderDetails();

  return (
    <div className="invoice">
      <header>
        <h1>S D ENGINEERS</h1>
        <address>
          131, SENGUPTA STREET,<br />
          RAMNAGAR,<br />
          COIMBATORE<br />
          TAMIL NADU<br />
          641009
        </address>
        {/* Other header details */}
      </header>

      <main>
        <table>
          <thead>
            <tr>
              <th>P.O.Sr.No</th>
              <th>PARTICULARS</th>
              <th>UOM</th>
              <th>QTY</th>
              <th>Rate Rs</th>
              <th>Total Rs</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((part) => (
              <tr key={part.id}>
                <td>{part.id}</td>
                <td>{part.partNo}</td>
                <td>{part.description}</td>
                <td>{part.uom}</td>
                <td>{part.qty}</td>
                <td>{part.rate}</td>
                <td>{part.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Other main content */}
      </main>

      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default Invoice;