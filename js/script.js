// Code goes here

var myFunction =function(){
	return false;
	var formdata = {};
  $('.btn').text("Resubmit");
  $('.btn').css("background-color","palegreen");
  $('input').each(function(){
    //put form data in object for use
    formdata[$(this).attr('name')] = parseFloat($(this).val());
  });
	
	// make a few intermediate calcs
  var return_in_accum = (formdata['return']-formdata.fees)/100*(1-formdata.tax/100);
  var return_in_retirement =  (1+(formdata['return']-formdata.fees)/100)/(1+formdata.inflation/100)-1;
  var contributions_post_tax = (formdata.current_income*formdata.contribution_rate/100+formdata.extra_contribution)*(1-formdata.tax/100);

  // calculate require income and required balance
  var nominal_required_income = -FV(formdata.inflation/100, formdata.years_to_retirement, formdata.required_income, 0);
  $('#nominal_required_income').text(accounting.formatMoney(nominal_required_income,'',0));
  
  var required_balance = -PV(return_in_retirement,formdata.years_required,nominal_required_income,0);
  $('#required_balance').text(accounting.formatMoney(required_balance,'',0));
  
  // calculate actual balance and income at retirement
  var retirement_balance = -FV(return_in_accum,
  formdata.years_to_retirement,
  formdata.current_savings,
  contributions_post_tax);
 
  $('#retirement_balance').text(accounting.formatMoney(retirement_balance,'',0));
  
  var actual_income = PMT(return_in_retirement,formdata.years_required,-1*retirement_balance,0);
  $('#actual_income').text(accounting.formatMoney(actual_income,'',0));

  //calculate shortfall
  if (required_balance > retirement_balance) {
    //$('#surp_short').text("Unfortunately you are short by: $");
    //$('#delta').text(accounting.formatMoney(required_balance-retirement_balance,'',0));
    $('#final_recommendation').css("color","red");
    var reqd_extra_contribution = 1/(1-formdata.tax/100)*PMT(return_in_accum, formdata.years_to_retirement, formdata.current_savings, -1*required_balance)-formdata.current_income*formdata.contribution_rate/100;
    $('#final_recommendation').text("Unfortunately you are short! You need to contribute an extra $" + accounting.formatMoney(reqd_extra_contribution,'',0) + " each year to meet your retirement goals.");
  }
  if (required_balance <= retirement_balance) {
    $('#final_recommendation').text("Good news! You are projected to have enough savings for retirement.");
    $('#final_recommendation').css("color","blue");
  }


  if (formdata.fees>0.6)
  {
    var low_fee_retirement_balance = -FV((formdata['return']-0.6)/100*(1-formdata.tax/100),
    formdata.years_to_retirement,
    formdata.current_savings,
    contributions_post_tax);
    var low_fee_benefit = low_fee_retirement_balance - retirement_balance
   $('#final_recommendation').append('It may be worth having a look at your fees. If you can get your fees down to 0.6%, you could have an extra $' + accounting.formatMoney(low_fee_benefit,'',0) + ' at retirement.');
  }
  $('div.outcome').css("display","inline");


  // work out datapoints before retirement
  var dataBeforeRetirement = arrayBeforeRetirement(return_in_accum,
  formdata.years_to_retirement,
  formdata.current_savings,
  contributions_post_tax);

    // work out datapoints after retirement
  var dataAfterRetirement = arrayAfterRetirement((formdata['return']-formdata.fees)/100,
  formdata.years_required,
  retirement_balance,
  nominal_required_income,
  formdata.inflation/100,
  formdata.years_to_retirement);

  var dataNeeded = [];
   // work out datapoints needed before retirement
  if (required_balance > retirement_balance) {
    var dataBeforeRetirement_Needed = arrayBeforeRetirement(return_in_accum,
    formdata.years_to_retirement,
    formdata.current_savings,
    contributions_post_tax + reqd_extra_contribution*(1-formdata.tax/100));

  // work out datapoints needed after retirement
    var dataAfterRetirement_Needed = arrayAfterRetirement((formdata['return']-formdata.fees)/100,
    formdata.years_required,
    required_balance,
    nominal_required_income,
    formdata.inflation/100,
    formdata.years_to_retirement);

    //combine needed to one array

    var dataNeeded = dataBeforeRetirement_Needed.concat(dataAfterRetirement_Needed);
  }


  // chart http://canvasjs.com/javascript-charts/
  //add what if fees were lower?
var chart = new CanvasJS.Chart("chartContainer",
  {
    animationEnabled: true,
    title:{
      text: "Projected Retirement Savings",
      fontFamily: "Calibri",
      fontSize: 18
    },
    data: [
    {
      type: "spline", //change type to bar, line, area, pie, etc
      name: "before retirement",
      showInLegend: true,        
      dataPoints: dataBeforeRetirement
    },
    {
      type: "spline", //change type to bar, line, area, pie, etc
      name: "after retirement",
      showInLegend: true,        
      dataPoints: dataAfterRetirement
    },
     {
      type: "spline", //change type to bar, line, area, pie, etc
      name: "needed",
      showInLegend: true, 
      lineDashType: "longDash",       
      markerType: "none",
      lineColor: "LightGrey",
      dataPoints: dataNeeded
    }
    ],
    axisY:{

      valueFormatString:  "#,##0", // move comma to change formatting
        prefix: "$"
    },
    axisX:{
       valueFormatString: "0",
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
      }
      chart.render();
      }
    }
  });
  
  chart.render();
alert('pause');

};

// make forms mobile friendly
// work out how to email it out???

