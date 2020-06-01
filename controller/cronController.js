const CronJob = require("cron").CronJob
const co2 = require("./co2Controller")
const ch4 = require("./ch4Controller")
const n2o = require("./n2oController")
const sf6 = require("./sf6Controller")
const temp = require("./berkeleyController")

// -----------------------

const runDailyUpdate = () => {
  co2.readDailyCO2()
  setTimeout(() => {
    co2.readWeeklyCO2()
  }, 10000)
}

const runMonthlyUpdate = () => {
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

const runAnnualCO2Update = () => {
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

const runAnnualOtherUpdate = () => {
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

const runATempUpdate = () => {
  temp.getAnnualTempAnomalyLS()
  // setTimeout(() => {
  //   co2.readAnnualCO2GL()
  //   setTimeout(() => {
  //     co2.readAnnualCO2IncreaseGL()
  //     setTimeout(() => {
  //       co2.readAnnualCO2IncreaseML()
  //     }, 10000)
  //   }, 10000)
  // }, 10000)
}

const dailyUpdate = new CronJob(
  "0 0 0,6,12,18 * * *",
  runDailyUpdate,
  null,
  true,
  "America/Los_Angeles"
)

const monthlyUpdate = new CronJob(
  "0 15 3 * * *",
  runMonthlyUpdate,
  null,
  true,
  "America/Los_Angeles"
)

const annualCO2Update = new CronJob(
  "0 30 4 1,7,14,28 * *",
  runAnnualCO2Update,
  null,
  true,
  "America/Los_Angeles"
)

const annualOtherUpdate = new CronJob(
  "0 45 5 2,5,12,27 * *",
  runAnnualOtherUpdate,
  null,
  true,
  "America/Los_Angeles"
)

const annualTempUpdate = new CronJob(
  "0 3 4 * * *",
  runATempUpdate,
  null,
  true,
  "America/Los_Angeles"
)
exports.run = () => {
  dailyUpdate.start()
  monthlyUpdate.start()
  annualCO2Update.start()
  annualOtherUpdate.start()
  annualTempUpdate.start()
}
