$(function () {
  function isWeekEven(date) {
    var referenceDate = new Date("2023-02-27");
    var diff = (date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
    var weekNumber = Math.floor(diff) + 1;
    var exceptions = [12, 13, 14, 15];
    if (exceptions.includes(weekNumber)) {
      return weekNumber % 2 === 0 ? "nieparzysty" : "parzysty";
    } else {
      return weekNumber % 2 === 0 ? "parzysty" : "nieparzysty";
    }
  }
  var date = new Date();
  if (date.getDay() !== 0 && date.getDay() !== 6) {
    // sprawdzenie, czy nie jest sobotą ani niedzielą
    var result = isWeekEven(date);
    var label = document.getElementById('tydzien');
    label.innerHTML = "Aktualnie mamy tydzień: <span class='week'>" + result + "</span>";
  }
  var urlParams = new URLSearchParams(window.location.search);
  var group_id = urlParams.get('group_id');
  var groupID = urlParams.get('nazwa');

    var grupa = document.getElementById('grupa');
    grupa.innerHTML = groupID;

  $.getJSON('https://plan.usos.tu.kielce.pl/api/lecturers', function (lecturers) {
    // map lecturer IDs to full names
    const lecturerMap = {};
    lecturers.forEach(function (lecturer) {
      lecturerMap[lecturer.lecturer_id] = lecturer.full_name;
    });


    $.getJSON('https://plan.usos.tu.kielce.pl/api/groups_classes/' + group_id, function (data) {
      var tbody = $('tbody');
      var days = ['PONIEDZIAŁEK', 'WTOREK', 'ŚRODA', 'CZWARTEK', 'PIĄTEK'];
      var rows = {};
      var start = 8;
      var end = 20;
      for (var i = start; i < end; i += 2) {
        var time = i.toString().padStart(2, '0') + ':00-' + (i + 2).toString().padStart(2, '0') + ':00';
        var tr = $('<tr>');
        tr.append($('<th>').text(time));
        for (var j = 0; j < days.length; j++) {
          var td = $('<td>');
          rows[days[j]] = rows[days[j]] || {};
          rows[days[j]][i] = td;
          tr.append(td);
        }
        tbody.append(tr);
      }
      for (var i = 0; i < data.length; i++) {
        var course = data[i];
        var type = course.type.toLowerCase();
        var day = course.day;
        var start = course.hr_start;
        var end = course.hr_end;
        var room = course.room;
        var name = course.name;
        var freq = course.frequency;
        var tydzien = '';
        if (freq == 'CO_TYDZIEN') { tydzien = 'Tydzień' }
        else if (freq == 'CO_DWA_TYG_PARZ') {
          tydzien = 'Parzyste';
        }
        else if (freq == 'CO_DWA_TYG_NIEPARZ') {
          tydzien = 'Nieparzyste';
        }
        var lecturerFullName = lecturerMap[course.lecturers_ids[0]];

        for (var j = start; j < end; j += 2) {
          var td = rows[day][j];
          var text = tydzien + '<br/>' + '<b>' + name.toUpperCase() + '</b>' + '<br/>' + '<b class="room">' + room + '</b><br/>' + lecturerFullName;
          if (rows[day][j].html() !== '') {
            text = rows[day][j].html() + '<hr/>' + text;
          }
          rows[day][j].addClass(type).html(text);
        }
      }
    });
  });
});

