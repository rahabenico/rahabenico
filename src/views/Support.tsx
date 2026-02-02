import { SaveMoneyEuroIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import RahabenicoLogo from "@/assets/rahabenico.svg";
import { Header } from "@/components/CardViewHeader";
import { Heading } from "@/components/Heading";

function Support() {
  return (
    <>
      <Header showSupportLink={false} />
      <div className="container mx-auto max-w-4xl space-y-12 px-4 pt-8 pb-18 md:pt-12 md:pb-24">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Heading level={2}>
                <span className="text-[#7E20D1]">Ra</span>ve <span className="text-[#7E20D1]">ha</span>rd.{" "}
                <span className="text-[#7E20D1]">Be</span> <span className="text-[#7E20D1]">ni</span>ce.{" "}
                <span className="text-[#7E20D1]">Co</span>nnect.
              </Heading>
              <Heading level={1} variant="main">
                Support <span className="text-primary">rahabenico</span>
              </Heading>
            </div>
          </div>
          <img src={RahabenicoLogo} alt="Rahabenico Logo" className="size-14" />
          <p>Support us</p>
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
    </>
  );
}

export default Support;
