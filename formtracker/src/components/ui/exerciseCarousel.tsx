import * as React from "react"
import { Card, CardContent, CardTitle } from "./card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel"

export default function ExerciseCarousel({ onSelect } : { onSelect: (exercise: string) => void }) {
  const items = [["/images/benchpress.png", "BENCH PRESS"], ["/images/bicepcurl.png", "BICEP CURL"], ["/images/squat.png", "SQUAT"]]


  return (
    <Carousel className="w-[80%] max-w-xl" setApi={(carouselApi) => {
      if (!carouselApi) return;
  
      // listen for changes
      const updateSelection = () => {
        const index = carouselApi.selectedScrollSnap();
        onSelect(items[index][1]);
      };
  
      // call immediately to set initial selection
      updateSelection();
  
      carouselApi.on("select", updateSelection);
    }}>
      <CarouselContent>
        {
        items.map((item, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                    <img src={item[0]} alt={item[1]} className="rounded-xl max-h-[560px]"></img>
                    <h2 className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-white text-center text-4xl font-bold drop-shadow-lg bg-neutral-700/50 w-full p-4">
                        {item[1]}
                    </h2>
              </Card>
            </div>
          </CarouselItem>
        ))
      }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
