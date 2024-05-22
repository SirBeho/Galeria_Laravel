import { useState } from "react";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
export default function Carousel({ slides }) {


  console.log(slides)
  let [current, setCurrent] = useState(0);

  let previousSlide = () => {
    if (current === 0) setCurrent(slides.length - 1);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === slides.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  return (
   
     
        <div className="flex w-full h-full overflow-hidden">
        {slides.map((s,index) => {
          return   (<div key={index} className="w-92 h-80 border border-red-500">
                      <img className="h-full w-full object-contain " src={`/images/${s}`} />
                  </div>);
        })}
        </div>

     
   
  );
}
