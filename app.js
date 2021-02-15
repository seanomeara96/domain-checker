const axios = require("axios");
const query = require("./businessCategories");
const fs = require("fs");
let count = 0;

function checkDomains() {
  axios
    .post("https://domains.google.com/v1/Main/FeSearchService/Search", {
      clientFilters: {},
      clientUserSpec: {
        countryCode: "US",
        currencyCode: "USD",
        sessionId: "-934712866",
      },
      debugType: "DEBUG_TYPE_NONE",
      query: query[count],
    })
    .then((res) => {
      let response = JSON.parse(res.data.slice(6));
      //console.log(response.searchResponse.results.result);
      let availableDotComDomains = [""];
      if (response.searchResponse.results.result[0].supportedResultInfo) {
        availableDotComDomains = response.searchResponse.results.result
          .filter(
            (item) =>
              item.domainName.tld == "com" &&
              item.supportedResultInfo.availabilityInfo.availability ==
                "AVAILABILITY_AVAILABLE"
          )
          .map(
            (domain) =>
              `${query[count]}\t${domain.domainName.sld}.${domain.domainName.tld}\n`
          );
      }
      console.log(availableDotComDomains);
      fs.appendFile("my_list.txt", availableDotComDomains.join(""), (err) => {
        if (err) throw err;
        if (count < query.length - 1) {
          count++;
          setTimeout(checkDomains, 1000);
        } else {
          console.log("done");
        }
      });
    });
}
checkDomains();
