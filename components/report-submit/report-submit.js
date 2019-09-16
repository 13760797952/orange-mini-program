var _analysisReport = require("../../services/analysis-report");

Component({
    methods: {
        submit: function submit(event) {
            (0, _analysisReport.reportFormID)(event.detail.formId);
        }
    }
});