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
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img src={item[0]} alt={item[1]} className="rounded-xl max-h-[560px] w-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6">
                    <h2 className="text-white text-center text-3xl md:text-4xl font-bold drop-shadow-lg">
                      {item[1]}
                    </h2>
                  </div>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))
      }
      </CarouselContent>
      <CarouselPrevious className="bg-white/90 hover:bg-white text-gray-900 border-0 shadow-lg" />
      <CarouselNext className="bg-white/90 hover:bg-white text-gray-900 border-0 shadow-lg" />
    </Carousel>
  )
}
