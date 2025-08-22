import * as React from "react"
import { Card, CardContent, CardTitle } from "./card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel"

export default function ExerciseCarousel() {
  const items = [["/images/benchpress.png", "Bench Press"], ["/images/bicepcurl.png", "Bicep Curl"], ["/images/squat.png", "Squat"]]
  return (
    <Carousel className="w-full max-w-xl">
      <CarouselContent>
        {/* {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))} */}
        {
        items.map((item, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                    <img src={item[0]} alt={item[1]} className="rounded-xl max-h-[600px]"></img>
                    <h2 className="absolute bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center text-2xl font-bold drop-shadow-lg">
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
