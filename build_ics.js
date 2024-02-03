let ics = require('ics');
let fs = require('fs');
let months = require('./public/data.json');

let events = [];
for (let i = 0; i < months.length; i++) {
  let month = months[i];
  for (let j = 0; j < month.games.length; j++) {
    let game = month.games[j];

    let { title, releaseDate, platforms } = game;
    events.push({
      title: title,
      description: `《${title}》 现已在 ${platforms.join('、')} 上推出`,
      start: releaseDate.split('.').map((n) => parseInt(n)),
      duration: { hours: 24 },
      url: 'https://game-calendar.liziyi0914.com',
      organizer: { name: '序碑工作室', email: 'games@xu-bei.cn' },
      location: platforms.join(', '),
    });
  }
}

ics.createEvents(events, (error, value) => {
  if (!error) {
    fs.writeFileSync('./public/games.ics', value);
    console.log('ICS file has been created successfully');
  } else {
    console.error(error);
  }
});
