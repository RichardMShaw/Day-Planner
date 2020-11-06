let planner = JSON.parse(localStorage.getItem("planner"));
if (planner === null) {
  planner = {
    open: 9,
    close: 18,
    events: []
  }
  for (let i = 0; i < 24; i++) {
    planner.events.push('')
  }
}



const dayPeriod = (val) => {
  if (11 < val && val < 24) {
    return 'PM'
  } else {
    return 'AM'
  }
}

const getDateSuffix = (val) => {
  val = parseInt(val)
  if (3 < val && val < 19) {
    return `th`
  }

  val %= 10

  if (val === 1) {
    return `st`
  } else if (val === 2) {
    return `nd`
  } else if (val === 3) {
    return `rd`
  } else {
    return `th`
  }
}

const getMonth = (val = 0) => {
  let month = (moment().month() + val) % 12
  if (month < 1) {
    month += 12
  }
  switch (month) {
    case 0: return "January"
    case 1: return "February"
    case 2: return "March"
    case 3: return "April"
    case 4: return "May"
    case 5: return "June"
    case 6: return "July"
    case 7: return "August"
    case 8: return "September"
    case 9: return "October"
    case 10: return "November"
    default: return "December"
  }
}

const getDayOfWeek = (val = 0) => {
  let day = (moment().day() + val) % 7
  if (day < 1) {
    day += 7
  }
  switch (day) {
    case 1: return "Monday"
    case 2: return "Tuesday"
    case 3: return "Wednesday"
    case 4: return "Thursday"
    case 5: return "Friday"
    case 6: return "Saturday"
    default: return "Sunday"
  }
}

const createSchedule = () => {
  let open = planner.open
  let close = planner.close
  let diff = 0
  if (open > close) {
    diff = (close + 24) - open
  } else {
    diff = close - open
  }
  let htmlText = ''
  let trueHour = moment().hour()
  let color = ['#b3b3b3', '#aeeaae', '#ffffb3']
  let time = -1// -1 past, 0 present, 1 future
  for (let i = 0; i < diff; i++) {
    let j = (open + i) % 24
    if (time === 0) {
      time = 1
    } else if (j === trueHour) {
      time = 0
    }
    let hour = j % 12
    if (hour === 0) {
      hour = 12
    }
    htmlText += `<div class="row">
                  <div class="col-md-2">
                    <div class="card">
                      <div id="cardBodyHour${j}" class="card-body card-body-hour">
                          <p>${hour}:00${dayPeriod(j)}</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-8">
                    <div class="card">
                      <div id="cardBodyEvent${j}" class="card-body card-body-event" style="background-color:${color[time + 1]};">
                          <textarea id="event${j}">${planner.events[j]}</textarea>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="card">
                      <div id="cardBodySave${j}" class="card-body card-body-save">
                          <button type="button" class="btn btn-primary btn-save" value="${j}"></button>
                      </div>
                    </div>
                  </div>
                </div>`
  }
  htmlText = htmlText.split('  ').join('')
  $('#container').html(htmlText)

}

const saveEvent = (val) => {
  planner.events[val] = $(`#event${val}`).val()
  localStorage.setItem('planner', JSON.stringify(planner))
}

const saveHours = () => {
  let open = parseInt($('#opening').val())
  let close = parseInt($('#closing').val())

  planner.open = open
  planner.close = close

  localStorage.setItem('planner', JSON.stringify(planner))
  createSchedule()
}

$('#currentDay').html(`<p>${getDayOfWeek()}, ${getMonth()} ${moment().date()}${getDateSuffix(moment().date())}</p>`)
$('#opening').val(planner.open)
$('#closing').val(planner.close)

createSchedule()


$('.btn-save').on('click', function () {
  saveEvent($(this).attr(`value`))
  $(this).text('\u2713')
  let timer = setTimeout(() => {
    $(this).text('')
  }, 1000);
})

$(document).on('click', function (event) {
  event.preventDefault()
  if ($(event.target).hasClass('btn-hours')) {
    saveHours()
  }
})