const co2 = require("./co2Controller")
const ch4 = require("./ch4Controller")
const n2o = require("./n2oController")
const sf6 = require("./sf6Controller")

// -----------------------

exports.runDailyUpdate = () => {
  console.log(" --------- new cron cycle ------")
  co2.readDailyCO2()
  setTimeout(() => {
    co2.readWeeklyCO2()
  }, 10000)
}

exports.runMonthlyUpdate = () => {
  co2.readMonthlyCO2ML()
  setTimeout(() => {
    co2.readMonthlyCO2GL()
    setTimeout(() => {
      ch4.readMonthlyCH4GL()
      setTimeout(() => {
        n2o.readMonthlyN2OGL()
        setTimeout(() => {
          sf6.readMonthlySF6GL()
        }, 10000)
      }, 10000)
    }, 10000)
  }, 10000)
}

exports.runAnnualCO2Update = () => {
  co2.readAnnualCO2ML()
  setTimeout(() => {
    co2.readAnnualCO2GL()
    setTimeout(() => {
      co2.readAnnualCO2IncreaseGL()
      setTimeout(() => {
        co2.readAnnualCO2IncreaseML()
      }, 10000)
    }, 10000)
  }, 10000)
}

exports.runAnnualOtherUpdate = () => {
  ch4.readAnnualCH4()
  setTimeout(() => {
    ch4.readAnnualGrowthRateCH4()
    setTimeout(() => {
      n2o.readAnnualN2O()
      setTimeout(() => {
        n2o.readAnnualGrowthRateN2O()
        setTimeout(() => {
          sf6.readAnnualSF6()
          setTimeout(() => {
            sf6.readAnnualGrowthRateSF6()
          }, 10000)
        }, 10000)
      }, 10000)
    }, 10000)
  }, 10000)
}

// -------------------------------------------------------------------
