var ReportEntity = (function () {

    function ReportEntity(name, className, date, grade,absence) {
        this.setName(name);
        this.setCalss(className);
        this.setDate(date);
        this.setGrade(grade);
        this.setAbsence(absence);
    }

    ReportEntity.prototype.getName = function () {
        return this._name
    }

    ReportEntity.prototype.setName = function (name) {
        this._name = name;
    }

    ReportEntity.prototype.getCalss = function () {
          return this._className;
    }

    ReportEntity.prototype.setCalss = function (className) {
            this._className = className;
    }

    ReportEntity.prototype.getDate = function () {
        return this._date
    }

    ReportEntity.prototype.setDate = function (date) {
        this._date = date;
    }

    ReportEntity.prototype.getGrade = function () {

        return parseInt(this._grade) ? this._grade : '-';
    }

    ReportEntity.prototype.setGrade = function (grade) {
        this._grade = grade;
    }

    ReportEntity.prototype.getAbsence = function () {
        return this._absence;
    }

    ReportEntity.prototype.setAbsence = function (absence) {
        this._absence = absence;
    }

    ReportEntity.prototype.addGrade = function (grade) {
        if(!parseInt(grade)){
            grade = 0;
        }
        var newGrade = parseInt(this.getGrade())+parseInt(grade);
        this.setGrade(newGrade)
    }

    ReportEntity.prototype.addAbsence = function (absence) {
        var newAbsence= parseInt(this.getAbsence())+parseInt(absence);
        this.setAbsence(newAbsence)
    }

    ReportEntity.prototype.toHtmlTableRow = function (key) {

        var row = $('<tr>');

        $('<td class="num-col">').text(parseInt(key)+1).appendTo(row);

        if(this.getName()){
            $('<td class="name-col">').text(this.getName()).appendTo(row);
            $('.name-col').show();
        }
        else{
            $('.name-col').hide()
        }

        if(this.getCalss()){
            $('<td class="class-col">').text(this.getCalss()).appendTo(row);
            $('.class-col').show()
        }
        else{
            $('.class-col').hide()
        }

        if(this.getDate()){
            $('<td class="date-col">').text(this.getDate()).appendTo(row);
            $('.date-col').show()
        }
        else{
            $('.date-col').hide()
        }

        if(this.getAbsence()||this.getAbsence()==0){
            $('<td class="absence">').text(this.getAbsence()).appendTo(row);
            $('.absence-col').show()
        }
        else{
            $('.absence-col').hide()
        }

        $('<td class="grade">').text(this.getGrade()).appendTo(row);

        return row;
    }

    return ReportEntity;
}());
