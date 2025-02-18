import { Button } from '@mantine/core';
import React, { FC, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../components/ThemeContext';

declare global {
    interface Window {
        hcaptcha: any; // Declare hcaptcha as a global variable
    }
}

interface SeatPageProps {}

const SeatPage: FC<SeatPageProps> = () => {
    const { theme } = useTheme();
    const bookingDetails = useParams();
    const [seating, setSeating] = useState<any[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [hCaptchaToken, setHCaptchaToken] = useState<string | null>(null); // State to store hCaptcha token
    const hCaptchaRef = useRef<HTMLDivElement>(null); // Ref for hCaptcha widget

    const generateSeatingGrid = (rows: number, cols: number) => {
        const seating = [];
        const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < rows; i++) {
            for (let j = 1; j <= cols; j++) {
                seating.push({
                    status: 'available',
                    id: `${rowLetters[i]}${j}`,
                });
            }
        }
        return seating;
    };

    useEffect(() => {
        setSeating(generateSeatingGrid(7, 7));
    }, []);

    const handleSeatSelection = (seatId: string) => {
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seatId)
                ? prevSelectedSeats.filter((id) => id !== seatId)
                : [...prevSelectedSeats, seatId]
        );
    };

    const getSeatColor = (seat: any) => {
        if (seat.status === 'unavailable') {
            return theme === 'light' ? 'bg-black' : 'bg-gray-700';
        } else if (selectedSeats.includes(seat.id)) {
            return 'bg-teal-500';
        } else {
            return theme === 'light' ? 'bg-gray-400' : 'bg-gray-600';
        }
    };

    const handlePayment = async () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat!");
            return;
        }

        if (!hCaptchaToken) {
            alert("Please complete the hCaptcha!");
            return;
        }

        try {
            // Verify hCaptcha token on the backend
            const hCaptchaResponse = await fetch("http://localhost:4001/apis/verify-captcha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ hCaptchaToken }),
            });

            const hCaptchaData = await hCaptchaResponse.json();

            if (!hCaptchaData.success) {
                alert("Invalid captcha. Please try again.");
                return;
            }
            console.log("hCaptcha Token:", hCaptchaToken);
            // Proceed with payment if hCaptcha is valid
            const paymentResponse = await fetch("http://localhost:4001/api/payments/create-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    selectedSeats,
                    movieId: bookingDetails.movie,
                    theatreId: bookingDetails.theater,
                    slot: bookingDetails.slot,
                    date: bookingDetails.date,
                    totalAmount: selectedSeats.length * 150, // ₹150 per seat
                }),
            });

            const paymentData = await paymentResponse.json();

            if (paymentResponse.ok && paymentData.url) {
                window.location.href = paymentData.url; // Redirect to Stripe checkout
            } else {
                console.error("Payment Error:", paymentData.error);
                alert("Payment failed. Please try again.");
            }
        } catch (error) {
            console.error("Payment Request Error:", error);
            alert("Something went wrong!");
        }
    };

    useEffect(() => {
        // Load hCaptcha script dynamically
        const script = document.createElement("script");
        script.src = "https://hcaptcha.com/1/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // Initialize hCaptcha
        script.onload = () => {
            if (window.hcaptcha && hCaptchaRef.current) {
                window.hcaptcha.render(hCaptchaRef.current, {
                    sitekey: "6d547e74-df48-41e2-9c96-92a44bb0419a", // Replace with your hCaptcha site key
                    theme: theme, // Optional: Set theme based on app theme
                    callback: (token: string) => {
                        console.log("hCaptcha Token Received:", token); // Log the token
                        setHCaptchaToken(token);
                    }, // Callback when hCaptcha is verified
                });
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [theme]);

    return (
        <React.Fragment>
            <div className={`flex items-center flex-col justify-center mt-5 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
                <div className={`container rounded-2xl p-4 flex justify-center items-center flex-col ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                    <div className="w-full max-w-[30rem] mx-auto my-6">
                        <div className="grid grid-cols-7 gap-2">
                            {seating.map((seat) => (
                                <div
                                    key={seat.id}
                                    className={`w-12 h-12 flex items-center justify-center font-bold ${getSeatColor(seat)} rounded-md cursor-pointer ${
                                        theme === 'light' ? 'text-white' : 'text-gray-100'
                                    }`}
                                    onClick={() => handleSeatSelection(seat.id)}
                                >
                                    {seat.id}
                                </div>
                            ))}
                        </div>
                        <p className={`text-center mt-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>SCREEN HERE</p>
                    </div>

                    {/* Add hCaptcha Widget */}
                    <div ref={hCaptchaRef}></div>

                    <Button
                        className='mt-4'
                        w={200}
                        style={{ backgroundColor: '#0d9488' }}
                        disabled={selectedSeats.length <= 0}
                        onClick={handlePayment} // Updated to trigger Stripe payment
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SeatPage;