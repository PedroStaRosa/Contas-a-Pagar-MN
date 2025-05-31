import AccountsPayableReader from "@/components/accountsPayableReader";
import FinanceCalendarPage from "@/components/financeCalendarPage";
import PaymentsOverview from "@/components/paymentsOverview";
import { Separator } from "@/components/ui/separator";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <main className="flex flex-col gap-4">
        <section className="flex w-full max-w-screen-2xl flex-col gap-6 sm:flex-row">
          <div className="w-full p-4">
            <FinanceCalendarPage />
          </div>
          <div className="w-full p-4">
            <AccountsPayableReader />
          </div>
        </section>
        <Separator />
        <section className="">
          <PaymentsOverview />
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
