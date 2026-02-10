import RahabenicoLogo from "@/assets/rahabenico.svg";
import { Heading } from "@/components/Heading";
import { Header } from "@/components/header";

function Impressum() {
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
                Impressum <span className="text-primary">rahabenico</span>
              </Heading>
            </div>
          </div>
          <img src={RahabenicoLogo} alt="Rahabenico Logo" className="size-14" />
        </div>

        <div className="space-y-8">
          <section>
            <Heading level={3} variant="section" className="mb-4">
              Contact & Legal Information
            </Heading>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-muted-foreground">Website</td>
                    <td className="p-4">rahabenico</td>
                  </tr>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-muted-foreground">Email</td>
                    <td className="p-4">dance@rahabenico.de</td>
                  </tr>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-muted-foreground">Verantwortlicher</td>
                    <td className="p-4">Richard Hermann</td>
                  </tr>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-muted-foreground">Address</td>
                    <td className="p-4">
                      Kurt-Eisner-Str. 87
                      <br />
                      04275 Leipzig
                    </td>
                  </tr>

                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-muted-foreground"></td>
                    <td className="p-4">Kleinunternehmer nach §19 UStG</td>
                  </tr>
                  <tr className="border-border border-b">
                    <td className="p-4 font-medium text-muted-foreground">Wirtschafts-ID</td>
                    <td className="p-4">Coming soon</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <Heading level={3} variant="section" className="mb-4">
              Additional Legal Information
            </Heading>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                <strong>Disclaimer:</strong> The contents of our pages have been created with the utmost care. However,
                we cannot guarantee the contents&apos; accuracy, completeness or topicality. According to statutory
                provisions, we are furthermore responsible for our own content on these web pages.
              </p>
              <p>
                <strong>Liability for links:</strong> Our offer contains links to external third party websites. We have
                no influence on the contents of those websites, therefore we cannot guarantee for those contents.
              </p>
              <ul className="list-inside list-disc space-y-2">
                <li>Responsibility for the content of linked pages lies solely with their operators.</li>
                <li>At the time of linking, no illegal contents were discernible on the linked pages.</li>
                <li>
                  A permanent monitoring of the contents of linked pages is not reasonable without concrete evidence of
                  a legal violation.
                </li>
              </ul>
              <p>
                <strong>Copyright:</strong> The content and works created by the site operators on these pages are
                subject to copyright. Duplication, processing, distribution, or any form of commercialization of such
                material beyond the scope of the copyright law shall require the prior written consent of its respective
                author or creator.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Impressum;
