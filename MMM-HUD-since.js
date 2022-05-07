Module.register("MMM-HUD-since", {
    defaults: {
        boldDays: false,
        date: "03/14/2020",
        dateFormat: "MM/dd/yyyy",
        displayDateFormat: "EEE, MMM. d, y",
        useHeader: true,
        header: "Days Since",
        width: "400px",
        loadDelay: 0,
        retryDelay: 2500,
        interval: 60 * 1000,
    },
    getScripts: function () {
        return [
            "https://moment.github.io/luxon/global/luxon.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"
        ];
    },
    getStyles: function() {
        return [
            "MMM-days-since.css"
        ];
    },
    start: function() {
        Log.info("Starting module: " + this.name);
        requiresVersion: "2.1.0",
        this.date = this.config.date;
        this.loaded = false;
        this.scheduleUpdate();
    },
    getDom: function() {
        let wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.width = this.config.width;
        if (!this.loaded) {
            wrapper.innerHTML = "Loading ...";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }
        let dateWrapper = document.createElement("div");
        dateWrapper.classList.add("date", "normal", "small");
        dateWrapper.innerHTML = this.displayDate;
        let daysWrapper = document.createElement("div");
        daysWrapper.classList.add("time", "large", "light", "bright");
        let numWrapper = document.createElement("span");
        if (this.config.boldDays) {
            numWrapper.classList.add("bold");
        }
        numWrapper.innerHTML = this.sinceDays;
        daysWrapper.innerHTML = "Day ";
        daysWrapper.appendChild(numWrapper);
        wrapper.appendChild(dateWrapper);
        wrapper.appendChild(daysWrapper);
        return wrapper;
    },
    scheduleUpdate: function() { 
        setInterval(() => {
            this.getData();
        }, this.config.interval);
        this.getData();
    },
    getData: function() {
        this.date = this.config.date;
        this.start = luxon.DateTime.fromFormat(this.date, this.config.dateFormat);
        this.displayDate = this.start.toFormat(this.config.displayDateFormat); 
        this.since = luxon.DateTime.local().diff(this.start, "days");
        this.sinceDays = numeral(this.since.days).format("0.0");
        this.loaded = true;
        this.updateDom(this.config.loadDelay);
    }
});
