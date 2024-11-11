"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import TestCounter from "./test-counter";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import React from "react";

export default function Page() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  const dataImageCarousel = [
    {
      id: 1,
      image: "/images/1.png",
      alt: "Image1",
    },
    {
      id: 2,
      image: "/images/2.png",
      alt: "Image2",
    },
    {
      id: 3,
      image: "/images/3.png",
      alt: "Image3",
    },
    {
      id: 4,
      image: "/images/4.png",
      alt: "Image4",
    },
  ];
  return (
    <>
      <div className="mt-16">
        <div>
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full">
            <CarouselContent>
              {dataImageCarousel.map((images) => (
                <CarouselItem key={images.id}>
                  <Image
                    alt={images.alt}
                    src={images.image}
                    priority={true}
                    width={500}
                    height={300}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div></div>
      </div>
      <TestCounter />
    </>
  );
}
