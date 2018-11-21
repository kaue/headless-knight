# [WIP]

# USAGE

`npm i --save headless-knight`

```javascript
const headless = require('headless-knight');
const page = await headless('https://google.com');
```

# TODO
- `page.evaluate()` should run a script inside page scope
- `page.scope` should return page scope
- `page.navigate(url)` should navigate to `url` keeping referrer


