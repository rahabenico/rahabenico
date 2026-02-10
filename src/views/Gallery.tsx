import { useQuery } from "convex/react";
import RahabenicoLogo from "@/assets/rahabenico.svg";
import { Heading } from "@/components/Heading";
import { Header } from "@/components/header";
import { LoadingBar } from "@/components/ui/spinner";
import { api } from "../../convex/_generated/api";

function Gallery() {
  const galleryImages = useQuery(api.gallery.getGalleryImages);

  const isLoading = galleryImages === undefined;

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <Header showSupportLink={true} showContactLink={true} />
      <div className="container mx-auto max-w-6xl space-y-12 px-4 pt-8 pb-18 md:pt-12 md:pb-24">
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
            Gallery
          </Heading>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        ) : !galleryImages || galleryImages.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">No images in the gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {galleryImages.map((image) =>
              image.url || image.description ? (
                <div key={image._id} className="group overflow-hidden rounded-lg">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.title || `Gallery image ${image._id}`}
                      className="h-auto w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  {(image.title || image.description) && (
                    <div className="bg-gray-100 p-4">
                      {image.title && <p className="font-medium text-sm">{image.title}</p>}
                      {image.description && <p className="mt-1 text-muted-foreground text-xs">{image.description}</p>}
                    </div>
                  )}
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Gallery;
