import { scaleOrdinal } from 'd3-scale';

export const colors = scaleOrdinal()
   .domain([
      "Negative Tests",
      "Inconclusive Tests",
      "Positive Tests"
   ])
   .range([
         "#88c7f0",
         "#FF854F",
         "#D41B2C"
   ])
