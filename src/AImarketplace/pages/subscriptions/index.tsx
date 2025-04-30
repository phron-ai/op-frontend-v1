import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import useSubscription from "AImarketplace/hooks/useSubscription";
import Subscription from "AImarketplace/components/subscription";
import "./index.scss";

const Subscriptions = () => {
  const { getSubscriptionForUser } = useSubscription();
  const [subscriptions, setSubscriptions] = useState([]);
  const { address } = useAccount();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const subs = await getSubscriptionForUser();
        setSubscriptions(subs);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };
    fetchSubscriptions();
  }, [address]);

  return (
    <div className="w-full">
      <div className="container mt-10 glassy-background !border-none rounded-lg pb-4">
        <Table>
          <TableCaption className={`${subscriptions?.length === 0 ? "py-10" : ""}`} >
            A list of your subscription.
          </TableCaption>
          <TableHeader className="bg-primary/80">
            <TableRow className="theme-gradient text-[8px] md:text-sm">
              <TableHead className="font-light tracking-wider py-1 md:py-4 uppercase text-white rounded-tl-lg pl-2 md:pl-6 text-center">
                Number
              </TableHead>
              <TableHead className="font-light tracking-wider py-1 md:py-4 uppercase text-white text-center">
                Oracle Id
              </TableHead>
              <TableHead className="font-light tracking-wider py-1 md:py-4 uppercase text-white text-center">
                Oracle Name
              </TableHead>
              <TableHead className="font-light tracking-wider py-1 md:py-4 uppercase text-white text-center">
                User Address
              </TableHead>
              <TableHead className="font-light tracking-wider py-1 md:py-4 uppercase text-white text-center">
                User Contract Id
              </TableHead>
              <TableHead className="font-light tracking-wider py-1 md:py-4 uppercase text-white rounded-tr-lg pr-2 md:pr-6 text-center">
                Expire
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions && subscriptions.length > 0 && subscriptions.map((item, index) => (
              <Subscription sub={item} key={index} index={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Subscriptions;
