var request = require("request");
var fs = require("fs");

const cache_path = "/tmp/api_cache.json";
boc_api = {};

/*
API constants.
*/
boc_api.base_api_url =
  "https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2";
boc_api.client_id = "4bbbc604-ef4b-47f7-86aa-5ddc04738612";
boc_api.client_secret = "D1bM1yW2qM7tK1rI3dT7yA3vQ0wM8tD4rW4oU5yR1nR0eW0xA7";
boc_api.tppid = "singpaymentdata"; //leave it as is.
boc_api.subStatus = {};

boc_api.oauthCode2 = "";
boc_api.sub_id = "";
boc_api.access_token = "";
boc_api.token_expires = "";

//A helper function used every time we want to post data to the API
function post(url, data, headers, callback) {
  //check if given destination url starts with a trailing dash and if true, prepend the API base url
  if (url.charAt(0) === "/") {
    url = boc_api.base_api_url + url;
  } else {
    url = url;
  }

  //if the headers object is not set, we should send a Content-Type header to avoid server errors
  if (!headers) {
    request.post(
      url,
      {
        form: data, // your payload data placed here
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      },
      callback
    );
  } else {
    request.post(
      url,
      {
        json: data, // your payload data placed here
        headers: headers
      },
      callback
    );
  }
}
//A helper function used every time we want to make a GET request to the API
function get(url, headers, callback) {
  var options = {
    url: boc_api.base_api_url + url,
    method: "GET",
    headers: headers
  };
  request(options, callback);
}

//A helper function used every time we want to make a PATCH request to the API
function patch(url, data, headers, callback) {
  request.patch(
    boc_api.base_api_url + url,
    {
      json: data,
      headers: headers
    },
    callback
  );
}

//Used to save the current boc_api values Such as subscriptionId, access_token etc.
boc_api.cacheApiObject = function() {
  //Stringify and save the boc_api object. The result JSON will only have the String values of the source object
  fs.writeFileSync(cache_path, JSON.stringify(boc_api));
};

//Used to read a previews status of boc_api. Reads a JSON file loading boc_api values
boc_api.readCacheApiObject = function() {
  //check if the cache file exists and return it's objects.
  if (fs.existsSync(cache_path)) {
    return JSON.parse(fs.readFileSync(cache_path));
  } else {
    return false;
  }
};

//Library init.
boc_api.init = async function(callback) {
  //Load the cache object
  cache_object = boc_api.readCacheApiObject();
  if (cache_object) {
    boc_api = { ...boc_api, ...cache_object };
  }

  if (!boc_api.access_token || Date.now() > boc_api.token_expires) {
    boc_api.access_token = await boc_api.get_access_token();
  }
  boc_api.checkAndCreateSubId().then(sub_id => {
    let login_url = boc_api.get_login_url(sub_id);
    console.log("LOGIN URL: " + login_url);
  });

  //we have an active token
};

boc_api.checkAndCreateSubId = function() {
  return new Promise((resolve, reject) => {
    if (boc_api.sub_id.length === 0) {
      boc_api.createSubscription().then(sub_id => {
        boc_api.sub_id = sub_id;
        resolve(sub_id);
      });
    }
  });
};

// Get subscriptions for account
boc_api.getSubForAccount = function(accountId) {
  return new Promise((resolve, reject) => {
    var url =
      "/v1/subscriptions/accounts/" +
      accountId +
      "?client_id=" +
      boc_api.client_id +
      "&client_secret=" +
      boc_api.client_secret;
    var headers = {
      Authorization: "Bearer " + boc_api.access_token,
      "Content-Type": "application/json",
      originUserId: "abc",
      tppId: boc_api.tppid,
      timestamp: Date.now(),
      journeyId: "abc"
    };
    get(url, headers, function(err, response, body) {
      if (err) {
        reject(err);
      }
      subForAccount = JSON.parse(body);
      resolve(subForAccount);
    });
  });
};

// Get available balance
boc_api.getAvailBalanceForAccount = function(accountId) {
  return new Promise((resolve, reject) => {
    if (boc_api.sub_id) {
      var url =
        "/v1/accounts/" +
        accountId +
        "/balance?client_id=" +
        boc_api.client_id +
        "&client_secret=" +
        boc_api.client_secret;
      var headers = {
        Authorization: "Bearer " + boc_api.access_token,
        "Content-Type": "application/json",
        originUserId: "abc",
        tppId: boc_api.tppid,
        timestamp: Date.now(),
        journeyId: "abc",
        subscriptionId: boc_api.sub_id
      };
      get(url, headers, function(err, response, body) {
        if (err) {
          reject(err);
        }
        subForAccount = JSON.parse(body);
        resolve(subForAccount);
      });
    } else {
      reject("missing subid");
    }
  });
};

// Get account statement
boc_api.getAccountStatements = function(
  accountId,
  startDate = "01/01/2016",
  endDate = "31/12/2018",
  maxCount = 0
) {
  return new Promise((resolve, reject) => {
    if (boc_api.sub_id) {
      var url =
        "/v1/accounts/" +
        accountId +
        "/statement?client_id=" +
        boc_api.client_id +
        "&client_secret=" +
        boc_api.client_secret +
        "&startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "&maxCount=" +
        maxCount;
      var headers = {
        Authorization: "Bearer " + boc_api.access_token,
        "Content-Type": "application/json",
        originUserId: "abc",
        tppId: boc_api.tppid,
        timestamp: Date.now(),
        journeyId: "abc",
        subscriptionId: boc_api.sub_id
      };
      get(url, headers, function(err, response, body) {
        if (err) {
          reject(err);
        }
        accountStatements = JSON.parse(body);
        resolve(accountStatements);
      });
    } else {
      reject("missing subid");
    }
  });
};

// Fund availability
boc_api.fundAvailability = function(
  accountId,
  amount = 100,
  bankId = "abc",
  currency = "EUR",
  currencyRate = 60
) {
  return new Promise((resolve, reject) => {
    var data = {
      bankId: bankId,
      accountId: accountId,

      transaction: {
        amount: amount,
        currency: currency,
        currencyRate: currencyRate
      }
    };
    var headers = {
      Authorization: "Bearer " + boc_api.access_token,
      "Content-Type": "application/json",
      app_name: "myapp",
      tppid: boc_api.tppid,
      subscriptionId: boc_api.sub_id,
      originUserId: "abc",
      timeStamp: Date.now(),
      journeyId: "abc"
    };

    post(
      "/v1/payments/fundAvailability?client_id=" +
        boc_api.client_id +
        "&client_secret=" +
        boc_api.client_secret,
      data,
      headers,
      function(error, response, body) {
        if (error) {
          reject(error);
        } else {
          console.log(response);
          //responseStatus = JSON.parse(body)
          resolve(body);
        }
      }
    );
  });
};
// Get payment details
boc_api.getPaymentDetails = function(paymentId) {
  return new Promise((resolve, reject) => {
    if (boc_api.sub_id) {
      var url =
        "/v1/payments/" +
        paymentId +
        "?client_id=" +
        boc_api.client_id +
        "&client_secret=" +
        boc_api.client_secret;
      var headers = {
        Authorization: "Bearer " + boc_api.access_token,
        "Content-Type": "application/json",
        originUserId: "abc",
        tppId: boc_api.tppid,
        timestamp: Date.now(),
        journeyId: "abc",
        subscriptionId: boc_api.sub_id
      };
      get(url, headers, function(err, response, body) {
        if (err) {
          reject(err);
        }
        paymentDetails = JSON.parse(body);
        resolve(paymentDetails);
      });
    } else {
      reject("missing subid");
    }
  });
};

boc_api.get_access_token = function() {
  return new Promise((resolve, reject) => {
    //Check if the app access token has expired and get a new one if needed.
    if (!boc_api.access_token.length || Date.now() > boc_api.token_expires) {
      var data = {
        client_id: boc_api.client_id,
        client_secret: boc_api.client_secret,
        grant_type: "client_credentials",
        scope: "TPPOAuth2Security"
      };
      post("/oauth2/token", data, null, function(error, response, body) {
        if (error) {
          reject(error);
        } else {
          token_response = JSON.parse(body);
          boc_api.token_expires = Date.now() + token_response.expires_in * 1000;
          if (token_response.access_token) {
            console.log("[Got Token]");
            access_token = token_response.access_token;
            boc_api.access_token = token_response.access_token;
            boc_api.cacheApiObject();
            resolve(boc_api.access_token);
          } else {
            reject(token_response, null);
          }
        }
      });
    } else {
      resolve(boc_api);
    }
  });
};

boc_api.tokenStatus = function(token) {
  var data = {
    client_id: boc_api.client_id,
    client_secret: boc_api.client_secret,
    token: token,
    token_type_hint: "access_token"
  };
  post("/oauth2/introspect", null, function(error, response, body) {
    if (error) {
      if (callback) {
        callback(error, null);
      }
    } else {
      console.log(body);
    }
  });
};

boc_api.createSubscription = function() {
  return new Promise((resolve, reject) => {
    var data = {
      accounts: {
        transactionHistory: true,
        balance: true,
        details: true,
        checkFundsAvailability: true
      },
      payments: {
        limit: 99999999,
        currency: "EUR",
        amount: 999999999
      }
    };
    var headers = {
      Authorization: "Bearer " + boc_api.access_token,
      "Content-Type": "application/json",
      app_name: "myapp",
      tppid: boc_api.tppid,
      originUserId: "abc",
      timeStamp: Date.now(),
      journeyId: "abc"
    };
    var url =
      "/v1/subscriptions?client_id=" +
      boc_api.client_id +
      "&client_secret=" +
      boc_api.client_secret;
    post(url, data, headers, function(err, response, body) {
      if (err) {
        reject(err);
      } else {
        subBody = body;
        sub_Id = subBody.subscriptionId;
        console.log("[GOT SUB_ID]");
        boc_api.sub_id = sub_Id;
        resolve(sub_Id);
      }
    });
  });
};

boc_api.get_login_url = function(subId) {
  if (!subId) {
    subId = boc_api.sub_id;
  }
  usrLoginUrl =
    boc_api.base_api_url +
    "/oauth2/authorize?response_type=code&redirect_uri=http://localhost:4200/boc-callback&scope=UserOAuth2Security&client_id=" +
    boc_api.client_id +
    "&subscriptionid=" +
    subId;
  return usrLoginUrl;
};

boc_api.getOAuthCode2 = function(code) {
  return new Promise((resolve, reject) => {
    var data = {
      client_id: boc_api.client_id,
      client_secret: boc_api.client_secret,
      grant_type: "authorization_code",
      scope: "UserOAuth2Security",
      code: code
    };
    post("/oauth2/token", data, null, function(err, response, body) {
      if (err) {
        reject(err);
      }
      oauthcode2 = JSON.parse(body).access_token;
      console.log("[GOT User Approval Code]");
      boc_api.oauthCode2 = oauthcode2;
      resolve(oauthcode2);
    });
  });
};

boc_api.getSubIdInfo = function(subId, oauthcode2) {
  return new Promise((resolve, reject) => {
    var url =
      "/v1/subscriptions/" +
      subId +
      "?client_id=" +
      boc_api.client_id +
      "&client_secret=" +
      boc_api.client_secret;
    var headers = {
      Authorization: "Bearer " + boc_api.access_token,
      "Content-Type": "application/json",
      originUserId: "abc",
      tppId: boc_api.tppid,
      timestamp: Date.now(),
      journeyId: "abc"
    };
    get(url, headers, function(err, response, body) {
      if (err) {
        reject(err);
      }
      subscription_info = JSON.parse(body);
      resolve(subscription_info);
    });
  });
};

boc_api.updateSubId = function(subId, oauthcode2, selectedAccounts) {
  return new Promise((resolve, reject) => {
    var data = {
      selectedAccounts: selectedAccounts,
      accounts: {
        transactionHistory: true,
        balance: true,
        details: true,
        checkFundsAvailability: true
      },
      payments: {
        limit: 99999999,
        currency: "EUR",
        amount: 999999999
      }
    };
    var headers = {
      Authorization: "Bearer " + oauthcode2,
      "Content-Type": "application/json",
      app_name: "myapp",
      tppid: boc_api.tppid,
      originUserId: "abc",
      timeStamp: Date.now(),
      journeyId: "abc"
    };

    var url =
      "/v1/subscriptions/" +
      subId +
      "?client_id=" +
      boc_api.client_id +
      "&client_secret=" +
      boc_api.client_secret;
    patch(url, data, headers, function(err, response, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
};

boc_api.getAccount = function(account_num, callback) {
  var url =
    "/v1/accounts/" +
    account_num +
    "?client_id=" +
    boc_api.client_id +
    "&client_secret=" +
    boc_api.client_secret;
  var headers = {
    subscriptionId: boc_api.sub_id,
    Authorization: "Bearer " + boc_api.access_token,
    "Content-Type": "application/json",
    originUserId: "abc",
    tppId: boc_api.tppid,
    timestamp: Date.now(),
    journeyId: "abc"
  };
  get(url, headers, function(err, response, body) {
    if (err) {
      callback(err, null);
    } else if (body.error) {
      callback(body.error, null);
    } else {
      accountResult = JSON.parse(body);
      callback(null, accountResult);
    }
  });
};

boc_api.getAccounts = function(callback) {
  var url =
    "/v1/accounts?client_id=" +
    boc_api.client_id +
    "&client_secret=" +
    boc_api.client_secret;
  var headers = {
    subscriptionId: boc_api.sub_id,
    Authorization: "Bearer " + boc_api.access_token,
    "Content-Type": "application/json",
    originUserId: "abc",
    tppId: boc_api.tppid,
    timestamp: Date.now(),
    journeyId: "abc"
  };
  get(url, headers, function(err, response, body) {
    if (err) {
      callback(err, null);
    } else if (body.error) {
      callback(body.error, null);
    } else {
      accountsResult = JSON.parse(body);
      callback(null, accountsResult);
    }
  });
};

boc_api.createPayment = function(signed_payload, callback) {
  var url =
    "/v1/payments?client_id=" +
    boc_api.client_id +
    "&client_secret=" +
    boc_api.client_secret;
  var data = signed_payload;

  var headers = {
    lang: "en",
    Authorization: "Bearer " + boc_api.access_token,
    "Content-Type": "application/json",
    subscriptionId: boc_api.sub_id,
    app_name: "myapp",
    tppid: boc_api.tppid,
    originUserId: "abc",
    correlationId: "xyz",
    timeStamp: Date.now(),
    journeyId: "abc"
  };
  post(url, data, headers, function(err, response, body) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, body);
    }
  });
};

boc_api.approvePayment = function(paymentId, authCodeBody, callback) {
  var url =
    "/v1/payments/" +
    paymentId +
    "/authorize?client_id=" +
    boc_api.client_id +
    "&client_secret=" +
    boc_api.client_secret;
  if (typeof authCodeBody === "function") {
    callback = authCodeBody;
  } else if (typeof authCodeBody === "object") {
    var data = authCodeBody;
  }

  if (!data) {
    var data = {
      transactionTime: Date.now(),
      authCode: "123456"
    };
  }

  var headers = {
    Authorization: "Bearer " + boc_api.access_token,
    "Content-Type": "application/json",
    subscriptionId: boc_api.sub_id,
    tppid: boc_api.tppid,
    originUserId: "abc",
    timeStamp: Date.now(),
    journeyId: "abc"
  };
  post(url, data, headers, function(err, response, body) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, body);
    }
  });
};

boc_api.getAccountPayments = function(account_num, callback) {
  var url =
    "/v1/payments/accounts/" +
    account_num +
    "?client_id=" +
    boc_api.client_id +
    "&client_secret=" +
    boc_api.client_secret;
  var headers = {
    subscriptionId: boc_api.sub_id,
    Authorization: "Bearer " + boc_api.access_token,
    "Content-Type": "application/json",
    originUserId: "abc",
    tppId: boc_api.tppid,
    timestamp: Date.now(),
    journeyId: "abc"
  };
  get(url, headers, function(err, response, body) {
    if (err) {
      callback(err, null);
    } else if (body.error) {
      callback(body.error, null);
    } else {
      paymentsResult = JSON.parse(body);
      callback(null, paymentsResult);
    }
  });
};

boc_api.signPaymentRequest = function(
  debtor,
  creditor,
  amount,
  paymentDetails,
  callback
) {
  var payload = false;
  if (typeof debtor === "object") {
    payload = debtor;
  }
  if (typeof creditor === "function") {
    callback = creditor;
  }

  var headers = {
    "Content-Type": "application/json",
    tppid: "singpaymentdata"
  };
  if (!payload) {
    var data = {
      debtor: {
        bankId: "",
        accountId: debtor
      },
      creditor: {
        bankId: "",
        accountId: creditor
      },
      transactionAmount: {
        amount: amount,
        currency: "EUR",
        currencyRate: "string"
      },
      endToEndId: "string",
      paymentDetails: paymentDetails,
      terminalId: "string",
      branch: "",
      executionDate: "",
      valueDate: ""
    };
  } else {
    var data = payload;
  }

  var url =
    "https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/jwssignverifyapi/sign";

  post(url, data, headers, function(err, response, body) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, body);
    }
  });
};

module.exports = boc_api;
