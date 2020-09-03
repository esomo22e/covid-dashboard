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

export const positivegroups = scaleOrdinal()
   .domain([
      "Students",
      "Faculty/Staff",
      "Contracted"
   ])
   .range([
         "#76b7b2",
         "#b07aa1",
         "#f28e2b"
   ])
