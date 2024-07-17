import Link from "next/link";
import React from "react";

const Upgrade = () => {
  const cardData = [
    {
      title: "Free",
      price: "₹0",
      features: ["✔ Create 5 Free Mock Interview", "✔ Unlimited Retake Interview", "✔ 1 User", "❌ Practice Questions", "❌ Exlusive Access For Prepration"],
    },
    {
      title: "Monthly",
      price: "₹499.0",
      features: ["✔ Create 30 Mock Interview", "✔ Unlimited Retake Interview", "✔ 2 User", "✔ Practice Questions", "❌ Exlusive Access For Prepration"],
      paymentLink: "https://buy.stripe.com/test_cN2cPI8TYbTF4E04gi"
    },
    {
      title: "Yearly",
      price: "₹5599.0",
      features: ["✔ Create Unlimited Mock Interview", "✔ Unlimited Retake Interview", "✔ 4 User", "✔ Practice Questions", "✔ Exlusive Access For Prepration"],
      paymentLink: "https://buy.stripe.com/test_aEUaHA2vA6zlgmIbIL"
    },
  ];
  return (
    <div>
        <h1 data-aos="fade-up" className="underline underline-offset-8 decoration-blue-500 text-center text-4xl font-semibold my-10">Upgrade</h1>
      <div data-aos="fade-up" className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:mx-28 mx-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`w-full shadow-[rgba(17,_17,_26,_0.1)_0px_0px_8px] flex flex-col p-4 rounded-lg hover:scale-105 duration-300`}
          >
            <h2 className="text-2xl text-center py-4">
              {card.title}
            </h2>
            <p className="text-center text-4xl font-bold">{card.price}</p>
            <div className="px-4">
              {card.features.map((feature, index) => (
                <p
                  key={index}
                  className="mt-5"
                >
                  {feature}
                </p>
              ))}
            </div>
           <Link href={`${card.paymentLink}`}>
           <button
              className="bg-gradient-to-r from-sky-400 to-blue-500 hover:text-blue-500 hover:from-gray-100 hover:to-gray-100 duration-150 text-white rounded-md font-medium my-6 w-full py-2"
            >
                
              Start Trial
            </button>
           </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upgrade;