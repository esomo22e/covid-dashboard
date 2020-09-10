export function digitFormat(number) {
    if ((number === undefined) || isNaN(number)) {
      return "n/a";
   } else {
      return number;
   }
};
