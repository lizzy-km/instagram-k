
const realTime = Date.now(); //Date Now
function GetTime(miliSec) {
  const diffTime = realTime - miliSec;
  const timeInSec = diffTime / 1000;
  const timeINMin = (timeInSec / 60).toFixed(0);
  const timeInHours = (timeINMin / 60).toFixed(0);

  return { timeINMin, timeInSec, timeInHours };
}

export default GetTime