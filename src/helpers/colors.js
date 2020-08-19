import { scaleOrdinal } from 'd3-scale';

export const colors = scaleOrdinal()
   .domain([
      "Tests Completed",
      "Tests in Progress",
      "Negative Tests",
      "Positive Tests",
   ])
   .range([
         "#006EB5",
         "#88c7f0",
         "#CFC7BF",
         "#D41B2C",
   ])
