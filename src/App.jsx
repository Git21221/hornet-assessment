import React from "react";
import { useDispatch, useSelector } from "react-redux";
import WalletGraph from "./components/WalletGraph";
import SidePanel from "./components/SidePanel";
import { toggleDarkMode } from "./redux/slices/graphSlice";

function App() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.graph.isDarkMode);

  const inflowData = {
    message: "success",
    data: [
      {
        beneficiary_address: "bc1qq7ldp3mza8q7q9e9gmzg72rzafyegckg57wluu",
        amount: 0.01000191,
        date: "2022-07-17 14:10:09",
        transactions: [
          {
            tx_amount: 0.01000191,
            date_time: "2022-07-17 14:10:09",
            transaction_id:
              "7e9885a3d2d236ea21bcb10c0b65f89010b3abbe9e705375b4f2856b0da32c7c",
          },
        ],
        entity_name: "Unknown",
        token_type: "BTC",
        transaction_type: "Normal Tx",
      },
      {
        beneficiary_address: "bc1qng0keqn7cq6p8qdt4rjnzdxrygnzq7nd0pju8q",
        amount: 2.4163156,
        date: "2022-07-17 14:10:09",
        transactions: [
          {
            tx_amount: 2.4163156,
            date_time: "2022-07-17 14:10:09",
            transaction_id:
              "7e9885a3d2d236ea21bcb10c0b65f89010b3abbe9e705375b4f2856b0da32c7c",
          },
        ],
        entity_name: "Changenow",
        token_type: "BTC",
        transaction_type: "Normal Tx",
      },
    ],
  };

  const outflowData = {
    message: "success",
    data: [
      {
        payer_address: "bc1qf786lw92dy09cx3tt9qhn4tf69dw9ak7m3ktkk",
        amount: 1.47741817,
        date: "2022-07-13 00:35:37",
        transactions: [
          {
            tx_amount: 1.47741817,
            date_time: "2022-07-13 00:35:37",
            transaction_id:
              "31e72dac1b2528efd3d6bf6b0108bd0558dbe2612ec6af3c9b0af746196af7c9",
          },
        ],
        entity_name: "Whitebit",
        token_type: "BTC",
        transaction_type: "Normal Tx",
      },
      {
        payer_address: "3Bn9uxMTY9HpTLaCo9YNBTq96QNhSYRxJk",
        amount: 0.02851,
        date: "2022-07-13 00:35:37",
        transactions: [
          {
            tx_amount: 0.02851,
            date_time: "2022-07-13 00:35:37",
            transaction_id:
              "31e72dac1b2528efd3d6bf6b0108bd0558dbe2612ec6af3c9b0af746196af7c9",
          },
        ],
        entity_name: "Unknown",
        token_type: "BTC",
        transaction_type: "Normal Tx",
      },
      {
        payer_address: "39RxUoh4ETUm37tprzYApgFJioQAUd8im9",
        amount: 0.53667821,
        date: "2022-07-13 00:35:37",
        transactions: [
          {
            tx_amount: 0.05406,
            date_time: "2022-07-13 00:35:37",
            transaction_id:
              "31e72dac1b2528efd3d6bf6b0108bd0558dbe2612ec6af3c9b0af746196af7c2",
          },
          {
            tx_amount: 0.48261821,
            date_time: "2022-07-13 00:35:37",
            transaction_id:
              "31e72dac1b2528efd3d6bf6b0108bd0558dbe2612ec6af3c9b0af746196af7c3",
          },
        ],
        entity_name: "Unknown",
        token_type: "BTC",
        transaction_type: "Normal Tx",
      },
      {
        payer_address: "bc1qre7n9nm6fec9ffqgsuk906qmg9mwvvsc99tytz",
        amount: 1.83390415,
        date: "2022-07-13 00:35:37",
        transactions: [
          {
            tx_amount: 1.83390415,
            date_time: "2022-07-13 00:35:37",
            transaction_id:
              "31e72dac1b2528efd3d6bf6b0108bd0558dbe2612ec6af3c9b0af746196af7c9",
          },
        ],
        entity_name: "Unknown",
        token_type: "BTC",
        transaction_type: "Normal Tx",
      },
    ],
  };

  const initialAddress = "bc1qmainwalletaddress";

  const handleToggleDarkMode = (event) => {
    event.stopPropagation();
    dispatch(toggleDarkMode());
    console.log("Dark mode toggled, new state:", !isDarkMode);
  };

  return (
    <div className="h-screen w-screen flex">
      <SidePanel inflowData={inflowData} outflowData={outflowData} />
      <div className="flex-1 relative h-full w-full">
        <WalletGraph
          inflowData={outflowData}
          outflowData={inflowData}
          initialAddress={initialAddress}
        />
        <button
          onClick={handleToggleDarkMode}
          className={`absolute top-4 right-4 p-2 rounded z-10 ${
            isDarkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Toggle {isDarkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}

export default App;