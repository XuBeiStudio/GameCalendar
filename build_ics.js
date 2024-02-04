let ics = require('ics');
let fs = require('fs');
let games = require('./data/data.json');
let dayjs = require('dayjs');
let utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

let events = [];
for (let j = 0; j < games.length; j++) {
  let game = games[j];

  let { title, releaseDate, platforms } = game;

  console.log(`Creating event for ${title}`);

  events.push({
    title: title,
    description: `《${title}》 现已在 ${platforms.join('、')} 上推出`,
    start: dayjs(`${releaseDate.replaceAll('.', '-')}T00:00:00+0800`)
      .utc()
      .format('YYYYMMDD[T]HHmmss[Z]'),
    duration: { hours: 24 },
    url: 'https://game-calendar.liziyi0914.com',
    organizer: { name: '序碑工作室', email: 'games@xu-bei.cn' },
    location: platforms.join(', '),
  });
}

ics.createEvents(events, (error, value) => {
  if (!error) {
    fs.writeFileSync('./public/games.ics', value);
    console.log('ICS file has been created successfully');
  } else {
    console.error(error);
  }
});
