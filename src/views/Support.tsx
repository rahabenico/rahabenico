import { SaveMoneyEuroIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import RahabenicoLogo from "@/assets/rahabenico.svg";
import { Heading } from "@/components/Heading";
import { Header } from "@/components/header";

function Support() {
  return (
    <>
      <Header showSupportLink={false} />
      <div className="container mx-auto max-w-4xl space-y-8 px-4 pt-8 pb-18 md:pt-12 md:pb-24">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Heading level={2}>
                <span className="text-[#7E20D1]">Ra</span>ve <span className="text-[#7E20D1]">ha</span>rd.{" "}
                <span className="text-[#7E20D1]">Be</span> <span className="text-[#7E20D1]">ni</span>ce.{" "}
                <span className="text-[#7E20D1]">Co</span>nnect.
              </Heading>
            </div>
          </div>
          <img src={RahabenicoLogo} alt="Rahabenico Logo" className="size-14" />
          <Heading level={1} variant="main">
            Support <span className="text-primary">rahabenico</span>
          </Heading>
        </div>

        <div className="space-y-8">
          <section>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-base">
                <tbody>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-primary">1€</td>
                    <td className="p-4 font-medium text-muted-foreground"></td>
                    <td className="p-4">You can define either task or artists or naming of 2 future cards</td>
                  </tr>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-primary">2€</td>
                    <td className="p-4 font-medium text-muted-foreground"></td>
                    <td className="p-4">You can define the tasks, the artists and the naming of 2 cards</td>
                  </tr>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-primary">5€</td>
                    <td className="p-4 font-medium text-muted-foreground">1 card</td>
                    <td className="p-4"></td>
                  </tr>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-primary">10€</td>
                    <td className="p-4 font-medium text-muted-foreground">2 cards</td>
                    <td className="p-4">Choose the tasks</td>
                  </tr>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-primary">20€</td>
                    <td className="p-4 font-medium text-muted-foreground">3 cards</td>
                    <td className="p-4">You can choose task, artists and naming of your cards</td>
                  </tr>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-primary">35€</td>
                    <td className="p-4 font-medium text-muted-foreground">6 cards</td>
                    <td className="p-4">You can choose task, artists and naming of your cards</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-primary">50€</td>
                    <td className="p-4 font-medium text-muted-foreground">10 cards</td>
                    <td className="p-4">You can choose task, artists and naming of your cards</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <div className="flex justify-center">
            <a
              href="https://www.paypal.com/pool/9miVHfr9hD?sr=ancr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary px-4 py-2 text-white hover:bg-primary/80"
            >
              <HugeiconsIcon icon={SaveMoneyEuroIcon} className="h-5 w-5" />
              Donate via PayPal
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Support;
