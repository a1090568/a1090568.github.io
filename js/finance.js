var PMT = function (rate,nper,PV,FV) {
  var sumPVfactor = 0, PVfactor = [1];
  for (var i = 1; i<=nper; i++) {
    PVfactor[i] = PVfactor[i-1] / (1 + rate);
    sumPVfactor += PVfactor[i];
  }
  //return(PVfactor[i-1]);
  return (-PV-FV*PVfactor[PVfactor.length-1])/(sumPVfactor);
};

var PV = function (rate,nper,PMT,FV) {
  var sumPVfactor = 0, PVfactor = [1];
  for (var i = 1; i<=nper; i++) {
    PVfactor[i] = PVfactor[i-1]/(1+rate);
    sumPVfactor += PVfactor[i];
  }
  return (-PMT*sumPVfactor -FV*PVfactor[PVfactor.length-1]);
};

var FV = function (rate,nper,PV,PMT) {
  var sumPVfactor = 0, PVfactor = [1];
  for (var i = 1; i<=nper; i++) {
    PVfactor[i] = PVfactor[i-1]/(1+rate);
    sumPVfactor += PVfactor[i];
  }
  return (-PV -PMT*sumPVfactor)/PVfactor[PVfactor.length-1];
};

var arrayBeforeRetirement= function (rate,nper,PV,PMT) {
  var year = new Date().getFullYear();
  var FV = [PV], dataPoints=[{x:year,y:PV}];
  for (var i = 1; i<=nper; i++) {
    FV[i] = FV[i-1]*(1+rate) + PMT;
    dataPoints.push({
      x: i + year,
      y: FV[i]
    });
  }
  return dataPoints;
};

var arrayAfterRetirement= function (rate,nper,PV,PMT,inflation,years_to_retirement) {
  var year = new Date().getFullYear();
  var FV = [PV], inflationFactor = [1], dataPoints=[{x: years_to_retirement+year, y: PV, label:'Retirement'}];
  for (var i = 1; i<=nper; i++) {
    inflationFactor[i] = inflationFactor[i-1]*(1+inflation);
    FV[i] = FV[i-1]*(1+rate) - PMT*inflationFactor[i];
    FV[i] = FV[i] < 0 ? 0 : FV[i]
    console.log(years_to_retirement)
    dataPoints.push({
      x: i + years_to_retirement + year,
      y: FV[i]
    });
  }
  return dataPoints;
};

