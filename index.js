"use strict";
const program = require('commander');
const request = require("request");
const cheerio = require("cheerio");
const color = require('bash-color');
const appInfo = require('./package.json');
const out = process.stdout;
const word = encodeURI(Array.prototype.slice.call(process.argv, 2).join(' '));
const dictList = ["bing", "youdao"];
if(word==='-V' || word==='-v' || word==='--help'){
	program
  .version(appInfo.version)
  .option('-v, --version', '版本号')
	.option('-V, --version', '版本号')
	.option('--help,--helpList','帮助中心')
  .parse(process.argv);
	if (program.version) console.log(appInfo.version);
}else{
	(function crawl(i) {
		let dotCount = 0;
		let option = require('./lib/' + dictList[i]);
		var f = setInterval(function() {
			++dotCount;
			if (dotCount > 3) {
				dotCount = 1;
			}
			out.clearLine();
			out.cursorTo(0);
			out.write(color.green('正在使用 ' + option.name + ' 查询' + '.'.repeat(dotCount)));
		}, 1000);
		request({
			url: option.url(word),
			headers: option.headers || {},
			timeout: 5000
		}, function(error, response, body) {
			clearInterval(f);
			out.clearLine();
			out.cursorTo(0);
			if (!error && response.statusCode == 200) {
				let $ = cheerio.load(body);
				let data = option.action($);
				if (typeof data === 'string') {
					i < dictList.length - 1 ? crawl(++i) : console.log(color.cyan(data));
				} else {
					data.map(function(item, index) {
						if (index === 0) {
							console.log("翻译: "+item);
					} else {
							console.log();
							console.log(color.wrap(' '+item[0]+' ', color.colors.RED, color.styles.background), item[1]);
						}
					});
				}
			} else {
				i < dictList.length - 1 ? crawl(++i) : console.log(color.red('查询失败', true));
			}
		});
	})(0);
}




