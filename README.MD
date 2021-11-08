

原来的代码默认去编译确实出现问题。
使用 ``node v14.18.1``，
在 ``package.json`` 中更改 ``ygo-card`` 依赖为 ``^1.2.7``，删掉 ``package-lock.json``，执行 ``npm audit fix``，然后执行 ``npm install`` 应该就可以使用了


# RUN

0. install nodejs: https://nodejs.org/en/download/
1. update your `resources/cards.cdb` to latest
2. move ydk file to `resources/deck/` (`test-deck.ydk` as example)
3. run `npm install`
4. run `node index.js test-deck`
5. checkout the pdf in `output/test-deck.pdf`

# THANKS

Thanks for the inspiration of `https://github.com/ymssx/yugioh-card`, there is lot's unclear params in this lib but I tested out...
