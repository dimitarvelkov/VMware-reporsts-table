(function main() {
    'use strict';

    $(document).ready(function () {
        $("thead .absence-col").on("click", function () {
            sortReports("_absence",sortReportByAbsence);
        });

        $("thead .grade-col").on("click", function () {
            sortReports("_grade",sortReportByGrade);
        });

        $("thead .name-col").on("click", function () {
            sortReports("_name",sortReportByName);
        });

        $("thead .class-col").on("click", function () {
            sortReports("_className",sortReportByClass);
        });

        $("thead .date-col").on("click", function () {
            sortReports("_date",sortReportByCompletedOnDate);
        });

        $("#numeration-hide-show").on("click", function () {
            isNumColShow = showHideTableColumns('.num-col')
        });
        $("#name-hide-show").on("click", function () {
            isNameColShow = showHideTableColumns('.name-col')
        });
        $("#class-hide-show").on("click", function () {
            isClassColShow = showHideTableColumns('.class-col');
        });
        $("#date-hide-show").on("click", function () {
            isDateColShow = showHideTableColumns('.date-col');
        });
        $("#absence-hide-show").on("click", function () {
            isAbsenceColShow = showHideTableColumns('.absence')
        });
        $("#grade-hide-show").on("click", function () {
            isGradeColShow = showHideTableColumns('.grade');
        });

        $("table th").on("click", function () {
            var downTriangle = $(this).children('.order-down-triangle');
            var upTriangle =   $(this).children('.order-up-triangle');
            var isDownTriangleHidden = $(downTriangle).is(':hidden');
            //$('.order-up-triangle').each(function () {
            //    $('.order-up-triangle').show()
            //});
            //
            //$('.order-down-triangle').each(function () {
            //    $('.order-down-triangle').show()
            //});
            $('#report th img').each(function () {
                $('#report th img').show()
            });

            if(isDownTriangleHidden){
                upTriangle.hide()
            }
            else{
                downTriangle.hide()
            }

        });

        $("body").click(function(event) {
            var targetId =event.target.id;
            if(targetId!=''){
                var targetIdWithSelector = "#"+targetId
            }
            var tableSettings = $('#table-settings');
            var isButtonInTableSettings= tableSettings.children(targetIdWithSelector).length > 0;
            if(targetId == "table-settings-show"){
                if(tableSettings.is(':hidden')) {
                    tableSettings.show();
                }
                else{
                    tableSettings.hide();
                }
            }
            else if(targetId!= "table-settings"&& !isButtonInTableSettings ||(targetId==''))
            {
                tableSettings.hide();
            }
        });
    });

    $('#table-group-format select').change(function() {

        var tableGroupFormat = $('#table-group-format select option:selected').val();

        switch (tableGroupFormat){
            case 'tableGroupByName':
                groupReport(groupByName,"450px");
                break;
            case 'tableGroupByClass':
                groupReport(groupByClass,"450px");
                break;
            case 'tableGroupByDate':
                groupReport(groupBydate,"450px");
                break;
            case 'tableBaseFormat':
                groupReport(tableBaseFormat,"700px");
                break;
            default:
                groupReport(tableBaseFormat,"700px");
                break;
        }

        $("#tableGroupByClass").on("click", function () {

            $('#table-body').html('');
            drawTable()
        });

        $("#tableGroupBydate").on("click", function () {

            $('#table-body').html('');
            drawTable()
        });
    });

    function checkTypeOfOrder(orderGroup){

        if(currentOrderBy.property==orderGroup){
            var isDescOrder = !currentOrderBy.isDescOrder;
            currentOrderBy = {property:orderGroup,isDescOrder:isDescOrder}
        }
        else{
            currentOrderBy = {property:orderGroup,isDescOrder:true}
        }
    }

    function showHideTableColumns(column){
        if (!$(column).is(':hidden')) {
            if(column=='.grade'){
                $('.grade-col').hide();
            }
            if(column=='.absence'){
                $('.absence-col').hide();
            }
            $(column).hide();
            return false;
        }
        else {
            if(column=='.grade'){
                $('.grade-col').show();
            }
            if(column=='.absence'){
                $('.absence-col').show();
            }
            $(column).show();
            return true;
        }
    }

    var currentOrderBy={};

    var ReportJSON = [];
    var ReportArray =[];

    var ReportEntitiesArray =[];
    var reportsForPrinting =[];

    var isNumColShow = true;
    var isClassColShow = true;
    var isNameColShow = true;
    var isDateColShow = true;
    var isGradeColShow = true;
    var isAbsenceColShow = true;

    AjaxRequester.get("Report/",function(data){
       var jsonStringResult =data.results[0].jsonReport;
       ReportJSON = JSON.parse(jsonStringResult);
        ReportArray = ReportJSON.report;
        createReportEntities();
        drawTable();

    },console.log(""));

    function createReportEntities() {
        for (var key in ReportArray) {
            var name = ReportArray[key].name.value;
            var className = ReportArray[key].class.value;
            var absence = ReportArray[key].absence.value;
            var completedOn = ReportArray[key].completedOn.value;
            var grade = parseInt(ReportArray[key].grade.value) ? ReportArray[key].grade.value : '-';
            var reportEntity = new ReportEntity(name.trim(),className.trim(),completedOn,grade,absence);
            reportsForPrinting.push(reportEntity) ;
        }
        ReportEntitiesArray = reportsForPrinting.slice();
    }

    function drawTable() {
        $("#report").children('td, th').each(function(){
            $(this).show()
        });

        for(var key in reportsForPrinting) {
            var row = reportsForPrinting[key].toHtmlTableRow(key);
            $('#table-body').append(row);
        }

        prepareTableSettings();

        hideUserStoppedColumns();

        reportGradeSumAbsenceSum();

        addTableStyle();
    }

    function addTableStyle(){
        $("#table-body tr:odd" ).css( "background-color",'#ECEBED');
        $("#table-body td" ).css( "padding", "10px");
        $("#table-body tr").hover(
            function () {
                $(this).css("background","#D7D7D7");
            },
            function () {
                $( "#table-body tr:odd" ).css( "background-color",'#ECEBED'  );
                $( "#table-body tr:even" ).css( "background-color",'#FFFFFF'  );
            }
        );
    }

    function prepareTableSettings(){
        $("#table-settings").children('input').each(function(){
            $(this).show()
        });

        var tableBody =$('#table-body');

        if ((tableBody).find(".num-col").length <= 0) {
            $("#numeration-hide-show").hide();
        }

        if ((tableBody).find(".name-col").length <= 0){
            $("#name-hide-show").hide();
        }

        if ((tableBody).find(".class-col").length <= 0){
            $("#class-hide-show").hide();
        }

        if ((tableBody).find(".date-col").length <= 0){
            $("#date-hide-show").hide();
        }

        if ((tableBody).find('.grade').length <= 0){
            $("#grade-hide-show").hide();
        }

        if ((tableBody).find('.absence').length <= 0){
            $("#absence-hide-show").hide();
        }
    }

    function hideUserStoppedColumns(){
        if(!isNumColShow){
            $('.num-col').hide();
        }
        if(!isClassColShow){
            $('.class-col').hide();
        }
        if(!isNameColShow){
            $('.name-col').hide();
        }
        if(!isDateColShow){
            $('.date-col').hide();
        }
        if(!isGradeColShow){
            $('.grade-col').hide();
            $('.grade').hide();
        }
        if(!isAbsenceColShow){
            $('.absence-col').hide();
            $('.absence').hide();
        }
    }

    function reportGradeSumAbsenceSum() {
        var gradeSum = 0;
        var absenceSum = 0;
        $('.grade').each(function () {
            if (parseInt($(this).text())) {
                gradeSum += parseInt($(this).text());
            }
        });

        $('.absence').each(function () {
            if (parseInt($(this).text())) {
                absenceSum += parseInt($(this).text());
            }
        });

        $('#gradeSum').html('Sum of grades:' + gradeSum);
        $('#absencesSum').html('Sum of absences:' + absenceSum);

    }

    function groupReport(groupFunction,tableWidth){
        groupFunction();
        $('#table-body').html('');
        $("#report").css("width",tableWidth);

        $('#report th img').each(function () {
            $('#report th img').show()
        });

        drawTable();
    }

    function groupByName(){
        var temporaryReports =[];
        for (var i = 0; i < ReportEntitiesArray.length; i++) {
            var absence = ReportEntitiesArray[i].getAbsence();
            var grade = ReportEntitiesArray[i].getGrade();
            var name = ReportEntitiesArray[i].getName();

            if(temporaryReports[name]){
                temporaryReports[name].addAbsence(absence);
                temporaryReports[name].addGrade(grade);
            }
            else {
                temporaryReports[name] = new ReportEntity();
                temporaryReports[name].setGrade(grade);
                temporaryReports[name].setAbsence(absence);
                temporaryReports[name].setName(name);
            }
        }

        temporaryArrayToPrintArray(temporaryReports)
    }

    function groupByClass(){
        var temporaryReports =[];

        for (var i = 0; i < ReportArray.length; i++) {
            var absence = ReportEntitiesArray[i].getAbsence();
            var grade = ReportEntitiesArray[i].getGrade();
            var className = ReportEntitiesArray[i].getCalss();

            if(temporaryReports[className]){
                temporaryReports[className].addAbsence(absence);
                temporaryReports[className].addGrade(grade);
            }
            else {
                temporaryReports[className] = new ReportEntity();
                temporaryReports[className].setCalss(className);
                temporaryReports[className].setAbsence(absence);
                temporaryReports[className].setGrade(grade);
            }
        }

        temporaryArrayToPrintArray(temporaryReports);
    }

    function groupBydate(){
        var temporaryReports =[];

        for (var i = 0; i < ReportArray.length; i++) {
            var absence = ReportEntitiesArray[i].getAbsence();
            var grade = ReportEntitiesArray[i].getGrade();
            var completedOn =ReportEntitiesArray[i].getDate();

            if(temporaryReports[completedOn]){
                temporaryReports[completedOn].addAbsence(absence);
                temporaryReports[completedOn].addGrade(grade);
            }
            else {
                temporaryReports[completedOn] = new ReportEntity();
                temporaryReports[completedOn].setDate(completedOn);
                temporaryReports[completedOn].setAbsence(absence);
                temporaryReports[completedOn].setGrade(grade);
            }
        }
        temporaryArrayToPrintArray(temporaryReports)
    }

    function tableBaseFormat(){
        reportsForPrinting =[];
        createReportEntities()
    }

    function sortReports(criteria,sortFunction){
        checkTypeOfOrder(criteria);
        reportsForPrinting.sort(sortFunction());
        $('#table-body').html('');
        drawTable()
    }

    function sortReportByAbsence() {
        return function (a, b) {
            var firstValue = a['_absence'];
            var secondValue = b['_absence'];
            if (firstValue == null) {
                firstValue = 0;
            }
            if (secondValue == null) {
                secondValue = 0;
            }

            var result =(parseInt(firstValue) < parseInt(secondValue)) ? -1 : (parseInt(firstValue) > parseInt(secondValue)) ? 1 : 0;
            if(!currentOrderBy.isDescOrder){
                return result*-1
            }
            return result;
        }
    }

    function sortReportByGrade() {
        return function (a, b) {
            var firstValue = a['_grade'];
            var secondValue = b['_grade'];
            if (firstValue == '-') {
                firstValue = 0;
            }

            if (secondValue == '-') {
                secondValue = 0;
            }

            var result = (parseInt(firstValue) < parseInt(secondValue)) ? -1 : (parseInt(firstValue) > parseInt(secondValue)) ? 1 : 0;
            if(!currentOrderBy.isDescOrder){
                return result*-1;
            }

            return result;
        }
    }

    function sortReportByCompletedOnDate() {
        return function(a,b) {
            var fitstdateParts = a['_date'].split(".");
            var secondDateParts = b['_date'].split(".");
            var dateOne = new Date(fitstdateParts[2], fitstdateParts[1], fitstdateParts[0], 0, 0, 0);
            var dateTwo = new Date(secondDateParts[2], secondDateParts[1], secondDateParts[0], 0, 0, 0);
            var order = 1;
            if (!currentOrderBy.isDescOrder) {
                order = -1;
            }
            if (dateOne > dateTwo) {
                return  order;
            }
            if (dateOne < dateTwo) {
                return -1 * order;
            }
            return 0;
        }
    }

    function sortReportByClass() {
        return function(a,b) {
            var firstValueToLower = a["_className"].toLocaleLowerCase();
            var secondValueToLower = b["_className"].toLocaleLowerCase();
            var result = (firstValueToLower < secondValueToLower ) ? -1 : (firstValueToLower > secondValueToLower) ? 1 : 0;
            if (!currentOrderBy.isDescOrder) {
                return result * -1;
            }
            return result;
        }
    }

    function sortReportByName() {
        return function(a,b) {
            var firstValueToLower = a['_name'].toLocaleLowerCase();
            var secondValueToLower = b['_name'].toLocaleLowerCase();
            var result = (firstValueToLower < secondValueToLower) ? -1 : (firstValueToLower > secondValueToLower) ? 1 : 0;
            if (!currentOrderBy.isDescOrder) {
                return result * -1;
            }
            return result;
        }
    }

    function temporaryArrayToPrintArray(temporaryArray){
        reportsForPrinting =[];
        for (var report in temporaryArray){
            reportsForPrinting.push(temporaryArray[report]);
        }
    }
}());