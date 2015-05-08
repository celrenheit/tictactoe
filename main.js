import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import logger from 'morgan'

let app = express()

// Express config
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './ui')));

export default app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});