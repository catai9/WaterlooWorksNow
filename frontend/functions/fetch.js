function fetchJSON(password = "", query, algorithmType) {
    app.status = STATUS.LOADING
    app.postings = []
    if (typeof ENDPOINT === 'undefined') {
        fetch('https://quiet-forest-33158.herokuapp.com/https://waterloo-searchworks-api.herokuapp.com/api/searchEngine', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'query': query, //TODO change to dynamically accepting header values
                'algorithmType': algorithmType
            },
        })
            .then((response) => response.json())
            .then((response) => response.results)
            .then(response => {
                if (typeof response != "undefined") {
                    for (let i = 0; i < response.length; i++) {
                        const key = Object.keys(response[i])[0];
                        const value = response[i][key];
                        app.postings.push(new JobPosting(key, value))
                    }
                }
                app.status = STATUS.READY
            })
    } else {
        ENDPOINT.searchParams.set('pwd', password);
        let xhr = new XMLHttpRequest();
        xhr.open("GET", ENDPOINT, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                for (const [key, value] of Object.entries(json)) {
                    app.postings.push(new JobPosting(key, value))
                }
                app.postings.forEach(x => {
                    x.TargetedClusters.themes.forEach(y => {
                        app.themesAndDegrees.themes.includes(y) || app.themesAndDegrees.themes.push(y)
                    });
                    x.TargetedClusters.degrees.forEach(y => {
                        app.themesAndDegrees.degrees.includes(y) || app.themesAndDegrees.degrees.push(y)
                    })
                })
                app.status = STATUS.READY
            }
            if (xhr.readyState === 4 && xhr.status === 401) {
                console.log("set auth failed")
                app.status = STATUS.AUTH_FAILED
                app.password = ""
                document.getElementById("passwordinput").focus()
            }
        };
        xhr.send();
    }
}