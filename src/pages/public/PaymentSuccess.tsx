import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketRef = useRef(null);

  // Sample ticket data (replace this with real data from your API or payment response)
  const ticketDetails = location.state || {
    movie: 'Oppenheimer',
    theatre: 'PVR Cinemas',
    date: '20 Feb 2025',
    time: '07:30 PM',
    seats: ['A1', 'A2', 'A3'],
    price: 150 * 3, // ₹150 per ticket
  };

  const handleDownloadPDF = () => {
    if (!ticketRef.current) return;

    toPng(ticketRef.current, { quality: 0.95 })
      .then((imgData) => {
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 180, 100);
        pdf.save(`ticket-${ticketDetails.movie}.pdf`);
      })
      .catch((error) => {
        console.error('PDF Generation Error:', error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Payment Successful! 🎉</h1>

      {/* Ticket Design */}
      <div ref={ticketRef} className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-96 relative">
        <div className="border-b pb-2 mb-2">
          <h2 className="text-xl font-semibold text-gray-800">{ticketDetails.movie}</h2>
          <p className="text-sm text-gray-500">{ticketDetails.theatre}</p>
        </div>
        <div className="text-sm text-gray-700">
          <p><strong>Date:</strong> {ticketDetails.date}</p>
          <p><strong>Time:</strong> {ticketDetails.time}</p>
          <p><strong>Seats:</strong> {ticketDetails.seats.join(', ')}</p>
          <p><strong>Total Price:</strong> ₹{ticketDetails.price}</p>
        </div>

        {/* Ticket Style */}
        <div className="absolute top-1/2 -right-5 w-10 h-10 bg-gray-100 border border-gray-300 rounded-full"></div>
        <div className="absolute top-1/2 -left-5 w-10 h-10 bg-gray-100 border border-gray-300 rounded-full"></div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          📄 Download Ticket
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-teal-500 text-white rounded-md shadow hover:bg-teal-600"
        >
          🏠 Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
