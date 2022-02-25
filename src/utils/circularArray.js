var count = 0;
var colours = [
  "EC6060",
  "4DB52E",
  "31D1B3",
  "1D9DCB",
  "1D3ACB",
  "AD70CC",
  "E84F82",
  "CB1212",
];
setInterval(() => {
  var randomNumber = Math.floor(Math.random() * 11);
  count = (count + randomNumber) % colours.length;
  var newColour = colours[count];
  const output = `We added <b>${randomNumber}</b>, meaning the new slot number to display is <b>${count}</b>, meaning a colour value of <b>${newColour}</b>`;
  console.log("dvdb - setInterval - output", output);
}, 3000);
