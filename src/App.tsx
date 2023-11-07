import gsap from "gsap";
import { animate } from "./animate";
import { useEffect, useMemo, useState } from "react";
import { Transaction, TransactionComponent } from "./TransactionComponent";
import { TransactionSkeletonComponent } from "./TransactionSkeletonComponent";
import { animateBars } from "./animateBars";

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /**
   * The percentage of each transaction based on the largest.
   */
  const percentages = useMemo(() => {
    // Get the amounts from the transactions.
    const amounts = transactions.map((transaction) => transaction.amount);

    // Get the max amount.
    const max = Math.max(...amounts);

    // Using the max amount as the base, get the percentage of each amount.
    // This will be used to set the height of each transaction.
    return amounts.map((amount) => (amount / max) * 100);
  }, [transactions]);

  /**
   * Animations effect.
   */
  useEffect(() => {
    const tl = gsap.timeline();

    animate(tl);

    return () => {
      tl.kill();
    };
  }, []);

  /**
   * Fetch transactions effect.
   */
  useEffect(() => {
    setTimeout(() => {
      (async function () {
        setTransactions(
          await fetch("/transactions.json").then((res) => res.json())
        );
      })();
    }, 3000);
  }, []);

  useEffect(() => {
    if (percentages.length == 0) return;

    console.log(percentages);

    animateBars(gsap.timeline(), percentages);
  }, [percentages]);

  return transactions.length == 0 ? (
    <TransactionSkeletonComponent bars={7} />
  ) : (
    <div
      aria-label="Transactions List"
      className="flex items-end w-full max-w-full gap-3"
    >
      {transactions.map((transaction, i) => (
        <TransactionComponent
          key={i}
          {...transaction}
          percentage={percentages[i]}
        />
      ))}
    </div>
  );
}

export default App;
