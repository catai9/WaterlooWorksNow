let settingsVersion = 1.1

var app = new Vue({
  el: '#app',
  data: {
    page: 0,
    postings: [],
    password: "",
    query: "",
    algorithmType: 3,
    status: STATUS.AUTHENTICATING,
//    settings: JSON.parse(localStorage.getItem("settings")),
    shortlist: JSON.parse(localStorage.getItem("shortlist")) ?? [],
    blacklist: JSON.parse(localStorage.getItem("blacklist")) ?? [],
    viewedlist: JSON.parse(localStorage.getItem("viewedlist")) ?? [],
    search: new URLSearchParams(window.location.search).has('s') ? new URLSearchParams(window.location.search).get('s') : "",
    STATUS: STATUS
  },
  computed: {
    filteredPostings: function () {
      return getSearch(app.postings, app.query, app.algorithmType);
    },
    showJobPostings: function () {
          return getJob()
    },
    Exported: function () {
      let shortliststr = ""
      let blackliststr = ""
      app.shortlist.forEach(x => shortliststr += `\t\"${x}\",\n`)
      app.blacklist.forEach(x => blackliststr += `\t\"${x}\",\n`)
      app.viewedlist.forEach(x => viewedliststr += `\t\"${x}\",\n`)
      return `let SHORTLIST = [\n${shortliststr}];\n\nlet VIEWEDLIST = [\n${viewedliststr}];`
    }
  },
  methods: {
    UpdateSearch: () => {
      let queryParams = new URLSearchParams(window.location.search);
      queryParams.set("s", app.search);
      queryParams.set("a", app.algorithmType);
      history.replaceState(null, null, "?" + queryParams.toString());
      app.query = app.search
      fetchJSON(app.password, app.query, app.algorithmType)
    },
    submitPassword: () => {
      app.status = STATUS.LOADING
      fetchJSON(app.password, "", 0)
    },
    saveSettings: () => {
      localStorage.setItem("settings", JSON.stringify(app.settings))
    },
    resetSettings: () => {
      app.settings = {
        version: 1.1,
      };
      app.saveSettings();
    },
    saveLists: () => {
      localStorage.setItem('shortlist', JSON.stringify(app.shortlist))
      localStorage.setItem('blacklist', JSON.stringify(app.blacklist))
      localStorage.setItem('viewedlist', JSON.stringify(app.viewedlist))
    },
    openJobPosting: (jobId) => {
        window.open("job.html?jobId=" + jobId, '_blank')
        //TODO: replace url parameter with api call
    }
  }
})

// Comment out the next line to use local data
// ENDPOINT = new URL('http://localhost:3000/')
if (typeof ENDPOINT === 'undefined') {
    fetchJSON('', app.query, app.algorithmType)
}

if (!(app.settings?.version == settingsVersion)){
  app.resetSettings()
}

localStorage.setItem("settings", JSON.stringify(app.settings))

//// Returns postings that match the set filters
//function getCleaned(postings) {
//  return postings
//}

function getJob() {
    console.log("getJob is called")
    var job = [];
    fetch('https://quiet-forest-33158.herokuapp.com/https://waterloo-searchworks-api.herokuapp.com/api/posting', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'docNo': 200001
              },
            })
            .then((response) => response.json())
            .then((response) => response.results)
            .then(response => {
                if (typeof response != "undefined"){
                    for (let i = 0; i < response.length; i++){
                        const key = Object.keys(response[i])[0];
                        const value = response[i][key];
                        job.push(new JobPosting(key, value))
                        console.log(job) //no job is pulled up
                    }
                    return job
                }

            })
}

// Get postings that match search results
//TODO fix this and link this to search button
function getSearch(postings, query, algorithmType) {
//    fetchJSON("", query, algorithmType)
//}
//    console.log("showJobPostings is called")
//    var job = [];
//    fetch('https://quiet-forest-33158.herokuapp.com/https://waterloo-searchworks-api.herokuapp.com/api/posting', {
//                method: 'GET',
//                headers: {
//                  'Content-Type': 'application/json',
//                  'docNo': 200001
//              },
//            })
//            .then((response) => response.json())
//            .then((response) => response.results)
//            .then(response => {
//                if (typeof response != "undefined"){
//                    for (let i = 0; i < response.length; i++){
//                        const key = Object.keys(response[i])[0];
//                        const value = response[i][key];
//                        job.push(new JobPosting(key, value))
//                    }
//                    return job
//                }
//
//            })
//    fetch('https://quiet-forest-33158.herokuapp.com/https://waterloo-searchworks-api.herokuapp.com/api/searchEngine', {
//                  method: 'GET',
//                  headers: {
//                    'Content-Type': 'application/json',
//                    'query': query, //TODO change to dynamically accepting header values
//                    'algorithmType': algorithmType
//                  },
//                })
//                .then((response) => response.json())
//                .then((response) => response.results)
//                .then(response => {
//                    if (typeof response != "undefined"){
//                        for (let i = 0; i < response.length; i++){
//                            const key = Object.keys(response[i])[0];
//                            const value = response[i][key];
//                            app.postings.push(new JobPosting(key, value))
//                        }
//                    }
//                })
    return postings
}