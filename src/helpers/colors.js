import { scaleOrdinal } from 'd3-scale';

export const colors = scaleOrdinal()
   .domain([
      "Negative Tests",
      "Positive Tests"
   ])
   .range([
         "#88c7f0",
         "#D41B2C"
   ])
